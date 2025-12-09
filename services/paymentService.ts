import { RazorpayOrderData, RazorpayPaymentData } from '../types';

// Use localhost for development, relative path for production (Vercel)
const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export const paymentService = {
    /**
     * Create a Razorpay order on the backend
     */
    async createOrder(userId: string): Promise<RazorpayOrderData> {
        const response = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }

        return response.json();
    },

    /**
     * Verify Razorpay payment on the backend
     */
    async verifyPayment(
        paymentData: RazorpayPaymentData,
        userId: string
    ): Promise<{ success: boolean; isPro: boolean }> {
        const response = await fetch(`${API_URL}/payments/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...paymentData,
                userId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Payment verification failed');
        }

        return response.json();
    },

    /**
     * Open Razorpay checkout popup
     */
    openRazorpayCheckout(
        orderData: RazorpayOrderData,
        userInfo: { name: string; email: string; contact?: string },
        onSuccess: (paymentData: RazorpayPaymentData) => void,
        onDismiss: () => void
    ): void {
        // Load Razorpay script if not already loaded
        if (!(window as any).Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                this._initializeCheckout(orderData, userInfo, onSuccess, onDismiss);
            };
            document.body.appendChild(script);
        } else {
            this._initializeCheckout(orderData, userInfo, onSuccess, onDismiss);
        }
    },

    /**
     * Initialize Razorpay checkout instance
     */
    _initializeCheckout(
        orderData: RazorpayOrderData,
        userInfo: { name: string; email: string; contact?: string },
        onSuccess: (paymentData: RazorpayPaymentData) => void,
        onDismiss: () => void
    ): void {
        const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'PollPath Pro',
            description: 'Unlock premium polling features',
            order_id: orderData.orderId,
            prefill: {
                name: userInfo.name,
                email: userInfo.email,
                contact: userInfo.contact || '',
            },
            theme: {
                color: '#1a1a2e', // brand-900 color
            },
            handler: function (response: any) {
                onSuccess({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });
            },
            modal: {
                ondismiss: onDismiss,
            },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    },
};
