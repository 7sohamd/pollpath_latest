import { getGeminiModel } from './_lib/gemini.js';
import { searchSimilarPolls, extractPollStructure, performWebSearch } from './_lib/pollSearch.js';

/**
 * Vercel Serverless Function for AI Copilot
 * POST /api/copilot
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
        const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'been', 'be',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'can',
            'may', 'must', 'i', 'me', 'my', 'we', 'our', 'you', 'your'];

        const questionWords = ['which', 'what', 'who', 'where', 'when', 'why', 'how',
            'should', 'would', 'could', 'can', 'will', 'shall',
            'might', 'ought', 'need', 'want'];

        const allWords = message
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));

        const contentWords = allWords.filter(word => !questionWords.includes(word));
        const qWords = allWords.filter(word => questionWords.includes(word));

        console.log(`🔍 Extracted from query:`);
        console.log(`   Content words: [${contentWords.join(', ')}]`);
        console.log(`   Question words: [${qWords.join(', ')}]`);

        // Search for similar polls
        const similarPolls = await searchSimilarPolls(contentWords, message);

        console.log(`✅ Found ${similarPolls.length} contextually relevant polls for query: "${message}"`);

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

        // System context
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
        const model = getGeminiModel();

        if (!model) {
            return res.status(503).json({
                error: 'AI service not configured',
                text: 'Sorry, the AI service is not available at this time.',
                pollCards: [],
                actionSuggestions: [],
            });
        }

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
        res.status(500).json({
            error: 'Failed to process request',
            text: 'Sorry, I encountered an error. Please try again.',
            pollCards: [],
            actionSuggestions: [],
        });
    }
}
