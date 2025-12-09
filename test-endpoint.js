import fetch from 'node-fetch';

async function testCopilotEndpoint() {
    try {
        console.log('Testing /api/copilot endpoint...');

        const response = await fetch('http://localhost:3001/api/copilot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Hello, can you help me?',
                history: [],
                pageContext: {}
            }),
        });

        console.log('Status:', response.status);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS!');
            console.log('AI Response:', data.text);
            console.log('Poll Cards:', data.pollCards?.length || 0);
        } else {
            console.log('❌ ERROR!');
            console.log('Error details:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ REQUEST FAILED:', error.message);
    }
}

testCopilotEndpoint();
