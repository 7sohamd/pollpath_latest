import { CopilotResponse, ChatMessage } from '../types';

// Use localhost for development, relative path for production (Vercel)
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';

export const aiService = {
    async sendChatMessage(
        message: string,
        history: ChatMessage[] = [],
        pageContext: { route?: string } = {}
    ): Promise<CopilotResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/copilot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    history: history.map(msg => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                    pageContext,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('AI service error:', error);

            // Return a fallback response
            return {
                text: "Sorry, I'm having trouble connecting right now. Please try again.",
                pollCards: [],
                actionSuggestions: [],
            };
        }
    },

    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/health`);
            return response.ok;
        } catch {
            return false;
        }
    },
};
