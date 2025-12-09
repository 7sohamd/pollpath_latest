import Razorpay from 'razorpay';

let razorpayInstance = null;

// Payment configuration
export const PRO_PLAN_AMOUNT = parseInt(process.env.PRO_PLAN_AMOUNT || '9900'); // Default: ₹99 in paise
export const PRO_PLAN_CURRENCY = process.env.PRO_PLAN_CURRENCY || 'INR';
export const PRO_PLAN_NAME = process.env.PRO_PLAN_NAME || 'pro-monthly';

/**
 * Initialize Razorpay SDK
 * Uses singleton pattern to avoid multiple initializations
 */
export function initializeRazorpay() {
    if (razorpayInstance) {
        return razorpayInstance;
    }

    try {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            razorpayInstance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });
            console.log('✅ Razorpay initialized successfully');
        } else {
            console.log('⚠️  Razorpay credentials not found - payment features will be disabled');
        }
    } catch (error) {
        console.error('⚠️  Failed to initialize Razorpay:', error.message);
    }

    return razorpayInstance;
}

/**
 * Get Razorpay instance
 * Initializes Razorpay if not already initialized
 */
export function getRazorpay() {
    if (!razorpayInstance) {
        initializeRazorpay();
    }
    return razorpayInstance;
}
