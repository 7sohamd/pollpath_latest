import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;
let embedModel = null;

/**
 * Initialize Gemini AI SDK
 * Uses singleton pattern to avoid multiple initializations
 */
export function initializeGemini() {
    if (genAI && model) {
        return { genAI, model, embedModel };
    }

    try {
        if (process.env.GEMINI_API_KEY) {
            genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
            console.log('✅ Gemini AI initialized successfully');
        } else {
            console.log('⚠️  Gemini API key not found');
        }
    } catch (error) {
        console.error('⚠️  Failed to initialize Gemini AI:', error.message);
    }

    return { genAI, model, embedModel };
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

/**
 * Get Gemini embedding model instance
 */
export function getGeminiEmbeddingModel() {
    if (!embedModel) {
        initializeGemini();
    }
    return embedModel;
}
