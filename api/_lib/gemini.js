import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

/**
 * Initialize Gemini AI SDK
 * Uses singleton pattern to avoid multiple initializations
 */
export function initializeGemini() {
    if (genAI && model) {
        return { genAI, model };
    }

    try {
        if (process.env.GEMINI_API_KEY) {
            genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            console.log('✅ Gemini AI initialized successfully');
        } else {
            console.log('⚠️  Gemini API key not found');
        }
    } catch (error) {
        console.error('⚠️  Failed to initialize Gemini AI:', error.message);
    }

    return { genAI, model };
}

/**
 * Get Gemini model instance
 * Initializes Gemini if not already initialized
 */
export function getGeminiModel() {
    if (!model) {
        initializeGemini();
    }
    return model;
}
