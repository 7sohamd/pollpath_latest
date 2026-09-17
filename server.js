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
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

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
            console.log(`📊 Firestore Admin: ${snapshot.data().count} total polls in database`);
        }).catch(err => {
            console.warn('⚠️  Firestore Admin query failed (will use Firestore REST fallback):', err.message);
        });
    } else {
        console.log('ℹ️  Firebase Admin credentials not provided - using Firestore REST API');
    }
} catch (error) {
    console.warn('⚠️  Firebase Admin initialization failed (using Firestore REST API):', error.message);
}

// In-memory cache for published polls
let cachedPolls = null;
let lastPollsFetchTime = 0;
const POLLS_CACHE_TTL = 30000; // 30 seconds

// In-memory cache for question embeddings
const embeddingCache = new Map();

// Helper to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
}

// Helper to fetch question embedding
async function getQuestionEmbedding(text) {
    if (!text || !embedModel) return null;
    const normalized = text.trim().toLowerCase();
    if (embeddingCache.has(normalized)) return embeddingCache.get(normalized);
    try {
        const res = await embedModel.embedContent(text);
        const vector = res.embedding?.values || null;
        if (vector) embeddingCache.set(normalized, vector);
        return vector;
    } catch {
        return null;
    }
}

// Helper to parse Firestore REST documents
function parseFirestoreValue(val) {
    if (!val) return null;
    if ('stringValue' in val) return val.stringValue;
    if ('integerValue' in val) return parseInt(val.integerValue, 10);
    if ('doubleValue' in val) return parseFloat(val.doubleValue);
    if ('booleanValue' in val) return val.booleanValue;
    if ('timestampValue' in val) return new Date(val.timestampValue);
    if ('nullValue' in val) return null;
    if ('arrayValue' in val) return (val.arrayValue.values || []).map(parseFirestoreValue);
    if ('mapValue' in val) {
        const res = {};
        for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
            res[k] = parseFirestoreValue(v);
        }
        return res;
    }
    return null;
}

// Fetch all published public polls with fallback
async function fetchPublishedPublicPolls() {
    const now = Date.now();
    if (cachedPolls && (now - lastPollsFetchTime < POLLS_CACHE_TTL)) {
        return cachedPolls;
    }

    // Try Firebase Admin first
    if (db) {
        try {
            const pollsRef = db.collection('polls');
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

            if (allPolls.length > 0) {
                cachedPolls = allPolls;
                lastPollsFetchTime = now;
                return allPolls;
            }
        } catch (adminErr) {
            console.warn('⚠️  Firestore Admin fetch failed, falling back to REST API:', adminErr.message);
        }
    }

    // Fallback: Firestore REST API using client API Key & Project ID
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = process.env.VITE_FIREBASE_API_KEY;
    if (projectId && apiKey) {
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/polls?key=${apiKey}&pageSize=100`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const documents = data.documents || [];
                const restPolls = documents.map(doc => {
                    const id = doc.name.split('/').pop();
                    const fields = doc.fields || {};
                    const poll = { id };
                    for (const [k, v] of Object.entries(fields)) {
                        poll[k] = parseFirestoreValue(v);
                    }
                    return poll;
                }).filter(p => {
                    const status = p.status || 'published';
                    const visibility = p.visibility || 'public';
                    return status === 'published' && visibility === 'public';
                });

                cachedPolls = restPolls;
                lastPollsFetchTime = now;
                console.log(`✅ Loaded ${restPolls.length} published polls via Firestore REST API`);
                return restPolls;
            }
        } catch (restErr) {
            console.error('❌ Firestore REST API fetch failed:', restErr.message);
        }
    }

    return [];
}

// Helper function to search polls using hybrid keyword and semantic search
async function searchSimilarPolls(keywords, originalQuery = '') {
    try {
        const allPolls = await fetchPublishedPublicPolls();
        if (!allPolls || allPolls.length === 0) {
            console.log('⚠️  No published polls available in database');
            return [];
        }

        console.log(`📚 Searching across ${allPolls.length} published polls from Firestore`);

        // Clean and prepare query text
        const cleanQuery = (originalQuery || keywords.join(' '))
            .replace(/[^\w\s]/g, ' ')
            .toLowerCase()
            .trim();
        const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

        // Deduplicate polls by question (keep poll with highest totalVotes)
        const dedupedMap = new Map();
        for (const poll of allPolls) {
            const key = (poll.question || '').trim().toLowerCase();
            const existing = dedupedMap.get(key);
            if (!existing || (poll.totalVotes || 0) > (existing.totalVotes || 0)) {
                dedupedMap.set(key, poll);
            }
        }
        const uniquePolls = Array.from(dedupedMap.values());

        // Get query embedding for semantic search
        let queryEmbedding = null;
        try {
            queryEmbedding = await getQuestionEmbedding(originalQuery || cleanQuery);
        } catch {
            queryEmbedding = null;
        }

        // Score polls using hybrid approach (exact match + keyword scoring + semantic similarity)
        const scoredPolls = [];

        for (const poll of uniquePolls) {
            let score = 0;
            const contentMatches = [];
            const lowerQuestion = (poll.question || '').toLowerCase();
            const cleanPollQuestion = lowerQuestion.replace(/[^\w\s]/g, ' ').trim();
            const pollTags = (poll.tags || []).map(t => String(t).toLowerCase());

            // 1. Exact or near-exact question match bonus
            if (cleanPollQuestion === cleanQuery || cleanPollQuestion.includes(cleanQuery) || cleanQuery.includes(cleanPollQuestion)) {
                score += 25;
                contentMatches.push('exact_or_substring_match');
            }

            // 2. Content word keyword matches
            keywords.forEach(keyword => {
                const cleanKeyword = keyword.replace(/[^\w\s]/g, '').toLowerCase().trim();
                if (!cleanKeyword) return;

                if (lowerQuestion.includes(cleanKeyword)) {
                    score += 5;
                    contentMatches.push(`question:${cleanKeyword}`);
                }
                pollTags.forEach(tag => {
                    if (tag.includes(cleanKeyword) || cleanKeyword.includes(tag)) {
                        score += 3;
                        contentMatches.push(`tag:${cleanKeyword}`);
                    }
                });
                (poll.options || []).forEach(option => {
                    const optLabel = String(option.label || '').toLowerCase();
                    if (optLabel.includes(cleanKeyword)) {
                        score += 2;
                        contentMatches.push(`option:${cleanKeyword}`);
                    }
                });
            });

            // 3. Fallback word overlap
            const matchedWordCount = queryWords.filter(w => lowerQuestion.includes(w)).length;
            if (queryWords.length > 0 && matchedWordCount >= Math.ceil(queryWords.length * 0.5)) {
                score += 10;
                contentMatches.push(`word_overlap:${matchedWordCount}/${queryWords.length}`);
            }

            // 4. Semantic similarity via Gemini embeddings
            let sim = 0;
            if (queryEmbedding && poll.question) {
                const pollEmbedding = await getQuestionEmbedding(poll.question);
                if (pollEmbedding) {
                    sim = cosineSimilarity(queryEmbedding, pollEmbedding);
                    if (sim >= 0.65) {
                        const simBoost = Math.round(sim * 20);
                        score += simBoost;
                        contentMatches.push(`semantic_similarity:${sim.toFixed(2)} (+${simBoost})`);
                    }
                }
            }

            // Require minimum relevance (score >= 10 OR high semantic similarity >= 0.70)
            if (score >= 10 || sim >= 0.70) {
                scoredPolls.push({ ...poll, score, sim, contentMatches });
            }
        }

        const topPolls = scoredPolls
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        if (topPolls.length > 0) {
            console.log(`✨ Hybrid search found ${topPolls.length} relevant polls:`);
            topPolls.forEach((poll, idx) => {
                console.log(`   ${idx + 1}. "${poll.question}" (score: ${poll.score}, matches: ${poll.contentMatches.join(', ')})`);
            });
        } else {
            console.log(`❌ No polls matched query: "${originalQuery}"`);
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

        const cleanMessage = message.replace(/[^\w\s]/g, ' ');
        const allWords = cleanMessage
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
