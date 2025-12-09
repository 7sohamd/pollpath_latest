/**
 * Vercel Serverless Function for Health Check
 * GET /api/health
 */
export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
}
