import { getFirestore } from './firebase.js';
import { getGeminiModel, getGeminiEmbeddingModel } from './gemini.js';

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
    const embedModel = getGeminiEmbeddingModel();
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

    const db = getFirestore();
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

/**
 * Search for similar polls using hybrid keyword and semantic search
 * @param {string[]} keywords - Array of search keywords
 * @param {string} originalQuery - Original user query for fallback search
 * @returns {Promise<Array>} Array of matching polls
 */
export async function searchSimilarPolls(keywords, originalQuery = '') {
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


/**
 * Extract poll structure from natural language query using Gemini AI
 * @param {string} query - User's natural language query
 * @returns {Promise<Object>} Extracted poll structure with question, options, and tags
 */
export async function extractPollStructure(query) {
    const model = getGeminiModel();

    if (!model) {
        console.log('⚠️  Gemini AI not initialized, using fallback extraction');
        return {
            question: query.endsWith('?') ? query : `${query}?`,
            options: [],
            suggestedTags: []
        };
    }

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

/**
 * Perform web search using DuckDuckGo API
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search result with summary and source
 */
export async function performWebSearch(query) {
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
