# Razorpay Pro Subscription Setup

## Environment Variables Setup

Add the following to your `.env.local` file:

```bash
# Razorpay Configuration
# Frontend (Key ID is safe to expose in frontend)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Backend (Keep Key Secret secure - only use in server.js)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Pro Plan Pricing (amounts in smallest currency unit - paise for INR)
PRO_PLAN_AMOUNT=9900          # ₹99 = 9900 paise
PRO_PLAN_CURRENCY=INR
PRO_PLAN_NAME=pro-monthly
```

## Getting Razorpay Test Credentials

1. Go to https://dashboard.razorpay.com
2. Sign up or log in
3. Switch to **Test Mode** (toggle in sidebar)
4. Navigate to **Settings → API Keys**
5. Copy your:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**
6. Add them to `.env.local`

## Pro Plan Configuration

You can customize the Pro plan pricing by changing:

- `PRO_PLAN_AMOUNT`: Price in paise (₹99 = 9900 paise, ₹499 = 49900 paise)
- `PRO_PLAN_CURRENCY`: Currency code (INR, USD, etc.)
- `PRO_PLAN_NAME`: Plan identifier (e.g., "pro-monthly", "lifetime-pro")

## Testing Payments

Use Razorpay test card details:

- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Name**: Any name

## Going Live

To switch to production:

1. In Razorpay Dashboard, switch from Test Mode to Live Mode
2. Generate new Live API Keys
3. Update `.env.local` with live credentials (replace `rzp_test_` with `rzp_live_`)
4. Test thoroughly in production before promoting
