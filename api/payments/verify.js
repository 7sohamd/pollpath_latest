import crypto from 'crypto';
import { getFirestore, admin } from '../_lib/firebase.js';
import { PRO_PLAN_NAME } from '../_lib/razorpay.js';

/**
 * Vercel Serverless Function for Verifying Razorpay Payments
 * POST /api/payments/verify
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('📨 Received request to /api/payments/verify');

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
            return res.status(400).json({ error: 'Missing required payment data' });
        }

        const db = getFirestore();

        if (!db) {
            return res.status(503).json({ error: 'Database not configured' });
        }

        // Verify signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            console.error('❌ Payment signature verification failed');
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        console.log(`✅ Payment signature verified for user: ${userId}`);

        // Update user's Pro status in Firestore
        const userRef = db.collection('users').doc(userId);
        await userRef.set({
            isPro: true,
            proPlan: PRO_PLAN_NAME,
            proSince: admin.firestore.FieldValue.serverTimestamp(),
            razorpayPaymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            razorpaySignature: razorpay_signature,
        }, { merge: true });

        console.log(`✅ Updated user ${userId} to Pro status`);

        res.json({ success: true, isPro: true });
    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        res.status(500).json({ error: 'Payment verification failed', message: error.message });
    }
}
