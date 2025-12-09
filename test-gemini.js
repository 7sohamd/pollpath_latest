import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
    try {
        console.log('Testing Gemini 2.5 Flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent('Hello, say hi!');
        const response = result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Response:', text);
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', error);
    }
}

testGemini();
