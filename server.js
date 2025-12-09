import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import admin from 'firebase-admin';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cron from 'node-cron';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Initialize Razorpay
let razorpay = null;
const PRO_PLAN_AMOUNT = parseInt(process.env.PRO_PLAN_AMOUNT || '9900'); // Default: ₹99 in paise
const PRO_PLAN_CURRENCY = process.env.PRO_PLAN_CURRENCY || 'INR';
const PRO_PLAN_NAME = process.env.PRO_PLAN_NAME || 'pro-monthly';

try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        console.log('✅ Razorpay initialized successfully');
    } else {
        console.log('⚠️  Razorpay credentials not found - payment features will be disabled');
    }
} catch (error) {
    console.error('⚠️  Failed to initialize Razorpay:', error.message);
}

// Initialize Firebase Admin (optional - only if credentials are provided)
let db = null;
try {
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        }
        db = admin.firestore();
        console.log('✅ Firebase Admin initialized successfully');

        // Log poll count on startup
        db.collection('polls').count().get().then(snapshot => {
            console.log(`📊 Firestore: ${snapshot.data().count} total polls in database`);
        }).catch(err => console.error('Failed to count polls:', err.message));
    } else {
        console.log('⚠️  Firebase Admin credentials not found - poll search will be disabled');
    }
} catch (error) {
    console.error('⚠️  Failed to initialize Firebase Admin:', error.message);
    console.log('   Poll search will be disabled. The AI will still work with web search.');
}


// Helper function to search polls by keywords
async function searchSimilarPolls(keywords, originalQuery = '') {
    // Minimum score threshold to be considered relevant
    // Requires at least 2 strong content word matches to avoid weak/irrelevant results
    // Score 10 = 2 words in question (5+5) or 1 question + 1 tag + options (5+3+2)
    const MIN_RELEVANCE_SCORE = 10;

    // If Firebase Admin is not initialized, return empty array
    if (!db) {
        console.log('⚠️  Poll search skipped - Firebase Admin not initialized');
        return [];
    }

    try {
        const pollsRef = db.collection('polls');

        // Query for published, public polls
        const querySnapshot = await pollsRef
            .where('status', '==', 'published')
            .where('visibility', '==', 'public')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const allPolls = [];
        querySnapshot.forEach((doc) => {
            allPolls.push({ id: doc.id, ...doc.data() });
        });

        console.log(`📚 Checking ${allPolls.length} published polls from Firestore`);

        // Filter and score polls based on CONTENT word matches only
        const scoredPolls = allPolls.map(poll => {
            let score = 0;
            let contentMatches = [];
            const lowerQuestion = poll.question.toLowerCase();
            const pollTags = (poll.tags || []).map(t => t.toLowerCase());
            const lowerKeywords = keywords.map(k => k.toLowerCase());

            // Check question matches (content words only - higher weight)
            lowerKeywords.forEach(keyword => {
                if (lowerQuestion.includes(keyword)) {
                    score += 5;  // Higher score for content word matches
                    contentMatches.push(`question:${keyword}`);
                }
            });

            // Check tag matches (content words)
            pollTags.forEach(tag => {
                lowerKeywords.forEach(keyword => {
                    if (tag.includes(keyword) || keyword.includes(tag)) {
                        score += 3;  // Medium score for tag matches
                        contentMatches.push(`tag:${keyword}`);
                    }
                });
            });

            // Check option matches (content words)
            (poll.options || []).forEach(option => {
                const lowerOption = option.label.toLowerCase();
                lowerKeywords.forEach(keyword => {
                    if (lowerOption.includes(keyword)) {
                        score += 2;  // Lower score for option matches
                        contentMatches.push(`option:${keyword}`);
                    }
                });
            });

            return { ...poll, score, contentMatches };
        });

        // Filter: require minimum score for relevance
        // This prevents showing polls that only weakly match (e.g., just one word)
        let topPolls = scoredPolls
            .filter(p => p.score >= MIN_RELEVANCE_SCORE)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // Log matching results with content word details
        if (topPolls.length > 0) {
            console.log(`✨ Content-based matching found ${topPolls.length} polls (min score: ${MIN_RELEVANCE_SCORE}):`);
            topPolls.forEach((poll, idx) => {
                console.log(`   ${idx + 1}. "${poll.question}" (score: ${poll.score}, matches: ${poll.contentMatches.join(', ')})`);
            });
        } else {
            const weakMatches = scoredPolls.filter(p => p.score > 0 && p.score < MIN_RELEVANCE_SCORE);
            if (weakMatches.length > 0) {
                console.log(`⚠️  Found ${weakMatches.length} polls with weak matches (below threshold of ${MIN_RELEVANCE_SCORE}):`);
                weakMatches.slice(0, 3).forEach((poll, idx) => {
                    console.log(`   - "${poll.question}" (score: ${poll.score}, matches: ${poll.contentMatches.join(', ')})`);
                });
                console.log(`   Not showing these - trying fallback full-text search instead...`);
            } else {
                console.log(`⚠️  No polls matched content words. Trying fallback full-text search...`);
            }
        }

        // FALLBACK: If no keyword matches, try full-text substring search
        if (topPolls.length === 0 && originalQuery) {
            const queryLower = originalQuery.toLowerCase().trim();
            const fullTextMatches = allPolls.filter(poll => {
                const questionLower = poll.question.toLowerCase();
                // Check for substantial overlap (at least 50% of query words appear in question)
                const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
                const matchCount = queryWords.filter(word => questionLower.includes(word)).length;
                return matchCount >= Math.ceil(queryWords.length * 0.5);
            });

            if (fullTextMatches.length > 0) {
                console.log(`✨ Full-text search found ${fullTextMatches.length} polls:`);
                fullTextMatches.forEach((poll, idx) => {
                    console.log(`   ${idx + 1}. "${poll.question}"`);
                });
                topPolls = fullTextMatches.slice(0, 5);
            } else {
                console.log(`❌ No polls found with full-text search either`);
            }
        }

        return topPolls;
    } catch (error) {
        console.error('❌ Error searching polls:', error);
        return [];
    }
}

// Helper function to extract poll structure from natural language query
async function extractPollStructure(query) {
    const extractionPrompt = `Extract a poll structure from this question:
    
"${query}"

Respond with ONLY a JSON object in this exact format:
{
  "question": "the poll question",
  "options": ["option 1", "option 2", "option 3"],
  "suggestedTags": ["tag1", "tag2"]
}

Rules:
- Keep the question natural and clear
- Extract 2-5 options from the query
- If query mentions specific choices (like "Python or JavaScript"), use them as options
- If no specific choices mentioned, suggest common relevant options for that topic
- Suggest 1-3 relevant tags based on the topic
- Return ONLY valid JSON, no markdown code blocks or explanation

Examples:
Query: "Should I learn Python or JavaScript?"
{"question": "Should I learn Python or JavaScript?", "options": ["Python", "JavaScript"], "suggestedTags": ["programming", "tech"]}

Query: "Which city should I move to?"
{"question": "Which city should I move to?", "options": ["New York", "San Francisco", "Austin"], "suggestedTags": ["travel", "life"]}`;

    try {
        const result = await model.generateContent(extractionPrompt);
        const text = result.response.text().trim();

        // Remove markdown code blocks if present
        const jsonText = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const extracted = JSON.parse(jsonText);
        console.log(`🎯 Extracted poll structure:`, extracted);

        return extracted;
    } catch (error) {
        console.error('❌ Failed to extract poll structure:', error);
        // Fallback: simple extraction
        return {
            question: query.endsWith('?') ? query : `${query}?`,
            options: [],
            suggestedTags: []
        };
    }
}


// Helper function to perform web search (simplified version)
async function performWebSearch(query) {
    try {
        // Using DuckDuckGo instant answer API (free, no key required)
        const response = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
        );
        const data = await response.json();

        if (data.AbstractText) {
            return {
                summary: data.AbstractText,
                source: data.AbstractURL || 'DuckDuckGo',
            };
        }

        // Fallback: return a simple message
        return {
            summary: 'Unable to find specific web information at this time.',
            source: null,
        };
    } catch (error) {
        console.error('Web search error:', error);
        return {
            summary: 'Unable to access web search at this time.',
            source: null,
        };
    }
}

// Main AI Copilot endpoint
app.post('/api/copilot', async (req, res) => {
    console.log('📨 Received request to /api/copilot');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    try {
        const { message, history = [], pageContext = {} } = req.body;

        if (!message) {
            console.log('❌ No message provided');
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('✅ Processing message:', message);

        // Extract keywords from user message for poll search
        // Use a minimal stop words list to preserve meaningful words like "city", "move", etc.
        const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'been', 'be',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'can',
            'may', 'must', 'i', 'me', 'my', 'we', 'our', 'you', 'your'];

        // Separate question words (low relevance) from content words (high relevance)
        const questionWords = ['which', 'what', 'who', 'where', 'when', 'why', 'how',
            'should', 'would', 'could', 'can', 'will', 'shall',
            'might', 'ought', 'need', 'want'];

        const allWords = message
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));

        // Content words are the meaningful ones (not question words)
        const contentWords = allWords.filter(word => !questionWords.includes(word));
        const qWords = allWords.filter(word => questionWords.includes(word));

        console.log(`🔍 Extracted from query:`);
        console.log(`   Content words: [${contentWords.join(', ')}]`);
        console.log(`   Question words: [${qWords.join(', ')}]`);

        // Search for similar polls (pass content words for contextual matching)
        const similarPolls = await searchSimilarPolls(contentWords, message);

        console.log(`✅ Found ${similarPolls.length} contextually relevant polls for query: "${message}"`);;;

        // Build context for Gemini
        let pollContext = '';
        if (similarPolls.length > 0) {
            pollContext = '\n\nRelevant PollPath polls found:\n';
            similarPolls.forEach((poll, idx) => {
                pollContext += `\nPoll ${idx + 1}:\n`;
                pollContext += `- Question: ${poll.question}\n`;
                pollContext += `- Options:\n`;
                (poll.options || []).forEach(opt => {
                    const percent = poll.totalVotes > 0
                        ? Math.round((opt.votesCount / poll.totalVotes) * 100)
                        : 0;
                    pollContext += `  * ${opt.label}: ${opt.votesCount} votes (${percent}%)\n`;
                });
                pollContext += `- Total Votes: ${poll.totalVotes}\n`;
                pollContext += `- Tags: ${(poll.tags || []).join(', ')}\n`;
            });
        }

        // Build conversation history for Gemini
        const conversationHistory = history.slice(-6).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // System context to prepend to the first message
        const systemContext = `You are PollPath Copilot, an AI assistant integrated into PollPath, a public polling application.

Your role:
- Help users make decisions by finding and analyzing relevant polls from the PollPath community
- Provide decisive, actionable insights based on poll data or web information
- Be conversational, helpful, and concise

When polls are found:
- Clearly state that you found similar polls on PollPath
- Summarize the key insights from the vote distributions
- Explain what the community seems to prefer and why
- Give a clear recommendation based on the data

When NO polls are found:
- Explicitly state: "I don't see any existing PollPath polls about this yet."
- Suggest creating a new poll
- Still provide helpful guidance based on general knowledge or web search
- Clearly indicate the insights are from external sources, not PollPath polls

Keep responses:
- Short and scannable (2-4 paragraphs max)
- Decisive and actionable
- Friendly and conversational
- Focused on helping the user make a decision

---

`;

        let prompt = systemContext + `${message}${pollContext}`;

        // If no polls found, perform web search
        let webSearchResult = null;
        if (similarPolls.length === 0) {
            webSearchResult = await performWebSearch(message);
            if (webSearchResult.summary && webSearchResult.summary !== 'Unable to find specific web information at this time.') {
                prompt += `\n\nWeb search result: ${webSearchResult.summary}`;
            }
        }

        // Call Gemini API
        const chat = model.startChat({
            history: conversationHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(prompt);
        const aiResponse = result.response.text();


        // Build response
        const response = {
            text: aiResponse,
            pollCards: similarPolls.map(poll => ({
                id: poll.id,
                question: poll.question,
                options: poll.options.slice(0, 3).map(opt => ({
                    label: opt.label,
                    votesCount: opt.votesCount,
                    percentage: poll.totalVotes > 0
                        ? Math.round((opt.votesCount / poll.totalVotes) * 100)
                        : 0,
                })),
                totalVotes: poll.totalVotes,
                tags: poll.tags || [],
            })),
            actionSuggestions: [],
        };

        // Add "create poll" suggestion if no polls found
        if (similarPolls.length === 0) {
            // Extract poll structure from the query for easier poll creation
            const suggestedPoll = await extractPollStructure(message);

            response.suggestedPoll = suggestedPoll;
            response.actionSuggestions.push({
                type: 'createPollInChat',
                label: 'Create this poll',
                payload: suggestedPoll,
            });
        }

        res.json(response);
    } catch (error) {
        console.error('❌ Copilot API error:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        res.status(500).json({
            error: 'Failed to process request',
            text: 'Sorry, I encountered an error. Please try again.',
            pollCards: [],
            actionSuggestions: [],
        });
    }
});

// ============================================================================
// RAZORPAY PAYMENT ENDPOINTS
// ============================================================================

// Create Razorpay order
app.post('/api/payments/create-order', async (req, res) => {
    console.log('📨 Received request to /api/payments/create-order');

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!razorpay) {
            return res.status(503).json({ error: 'Payment service not configured' });
        }

        const options = {
            amount: PRO_PLAN_AMOUNT, // amount in smallest currency unit (paise)
            currency: PRO_PLAN_CURRENCY,
            receipt: `rcpt_${Date.now()}`, // Shortened to fit 40 char limit
            notes: {
                userId,
                plan: PRO_PLAN_NAME,
            },
        };

        const order = await razorpay.orders.create(options);

        console.log(`✅ Created Razorpay order: ${order.id} for user: ${userId}`);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('❌ Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create order', message: error.message });
    }
});

// Verify Razorpay payment
app.post('/api/payments/verify', async (req, res) => {
    console.log('📨 Received request to /api/payments/verify');

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
            return res.status(400).json({ error: 'Missing required payment data' });
        }

        if (!db) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        // Verify signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            console.error('❌ Payment signature verification failed');
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        console.log(`✅ Payment signature verified for user: ${userId}`);

        // Update user's Pro status in Firestore
        const userRef = db.collection('users').doc(userId);
        await userRef.set({
            isPro: true,
            proPlan: PRO_PLAN_NAME,
            proSince: admin.firestore.FieldValue.serverTimestamp(),
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            razorpaySignature: razorpay_signature,
        }, { merge: true });

        console.log(`✅ Updated user ${userId} to Pro status`);

        res.json({ success: true, isPro: true });
    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        res.status(500).json({ error: 'Payment verification failed', message: error.message });
    }
});

// ============================================================================
// AUTO-DELETE FREE TIER POLLS (CRON JOB)
// ============================================================================

// Run every hour to delete free tier polls older than 24 hours
cron.schedule('0 * * * *', async () => {
    console.log('🕒 Running auto-delete cron job for free tier polls...');

    if (!db) {
        console.log('⚠️  Skipping auto-delete: Firebase not configured');
        return;
    }

    try {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pollsSnapshot = await db.collection('polls')
            .where('ownerIsPro', '==', false)
            .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(cutoffTime))
            .get();

        if (pollsSnapshot.empty) {
            console.log('✅ No free tier polls to delete');
            return;
        }

        const batch = db.batch();
        let count = 0;

        pollsSnapshot.forEach((doc) => {
            // Soft delete: set status to 'deleted'
            batch.update(doc.ref, { status: 'deleted' });
            count++;
        });

        await batch.commit();
        console.log(`✅ Soft-deleted ${count} free tier polls older than 24 hours`);
    } catch (error) {
        console.error('❌ Error in auto-delete cron job:', error);
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 PollPath AI Copilot server running on http://localhost:${PORT}`);
    console.log(`📡 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'NOT configured'}`);
    console.log(`🔥 Firebase: ${process.env.VITE_FIREBASE_PROJECT_ID ? 'Configured' : 'NOT configured'}`);
});
