import { getFirestore } from './firebase.js';
import { getGeminiModel } from './gemini.js';

/**
 * Search for similar polls by keywords
 * @param {string[]} keywords - Array of search keywords
 * @param {string} originalQuery - Original user query for fallback search
 * @returns {Promise<Array>} Array of matching polls
 */
export async function searchSimilarPolls(keywords, originalQuery = '') {
    // Minimum score threshold to be considered relevant
    const MIN_RELEVANCE_SCORE = 10;

    const db = getFirestore();

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
