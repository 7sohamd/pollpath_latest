import { getRazorpay, PRO_PLAN_AMOUNT, PRO_PLAN_CURRENCY, PRO_PLAN_NAME } from '../_lib/razorpay.js';

/**
 * Vercel Serverless Function for Creating Razorpay Orders
 * POST /api/payments/create-order
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('📨 Received request to /api/payments/create-order');

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const razorpay = getRazorpay();

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
}
