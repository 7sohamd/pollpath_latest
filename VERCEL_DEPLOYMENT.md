# Vercel Deployment Guide for PollPath

This guide walks you through deploying your PollPath application to Vercel with serverless functions.

## 🏗️ Architecture Overview

Your backend has been converted from a traditional Express server to **Vercel Serverless Functions**:

- **Frontend**: Vite + React (deployed to Vercel CDN)
- **Backend APIs**: Serverless functions in `/api` directory
- **Cron Jobs**: Vercel Cron (runs daily for poll cleanup)
- **Database**: Firebase Firestore (no changes)
- **Payments**: Razorpay (no changes)
- **AI**: Google Gemini (no changes)

## 📁 Project Structure

```
pollpath/
├── api/                           # Serverless API functions
│   ├── _lib/                      # Shared utilities
│   │   ├── firebase.js            # Firebase Admin singleton
│   │   ├── gemini.js              # Gemini AI singleton
│   │   ├── razorpay.js            # Razorpay SDK singleton
│   │   └── pollSearch.js          # Poll search & extraction logic
│   ├── payments/                  # Payment endpoints
│   │   ├── create-order.js        # POST /api/payments/create-order
│   │   └── verify.js              # POST /api/payments/verify
│   ├── cron/                      # Cron job functions
│   │   └── cleanup-polls.js       # Daily poll cleanup
│   ├── copilot.js                 # POST /api/copilot (AI chat)
│   └── health.js                  # GET /api/health
├── components/                    # React components
├── services/                      # Frontend API services
├── vercel.json                    # Vercel configuration
└── server.js                      # OLD Express server (unused)
```

## 🚀 Deployment Steps

### 1. Prerequisites

- GitHub account with your PollPath repository
- Vercel account (free tier works)
- All environment variables ready (see `.env.local`)

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### 3. Configure Build Settings

Vercel should auto-configure, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Add Environment Variables

> [!IMPORTANT]
> You MUST add all environment variables in the Vercel dashboard before deploying.

Go to **Project Settings → Environment Variables** and add:

#### Required Variables

| Variable | Description | Example Value |
|----------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSyD...` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `pollpath-123abc` |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | `firebase-adminsdk@...` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | `-----BEGIN PRIVATE KEY-----\n...` |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | `your_secret_key` |

#### Optional Variables (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `PRO_PLAN_AMOUNT` | `9900` | Pro plan price in paise (₹99) |
| `PRO_PLAN_CURRENCY` | `INR` | Currency code |
| `PRO_PLAN_NAME` | `pro-monthly` | Plan identifier |

> [!WARNING]
> For `FIREBASE_PRIVATE_KEY`, make sure to include the entire key with line breaks (`\n`). In Vercel, you can paste it directly with actual newlines.

#### Frontend Environment Variables

Add these for your frontend (from your existing `.env.local`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### 5. Deploy

1. Click **Deploy**
2. Vercel will build and deploy your app
3. You'll get a URL like `https://pollpath.vercel.app`

### 6. Verify Deployment

Test all endpoints:

1. **Frontend**: Visit your Vercel URL
2. **Health Check**: `https://your-app.vercel.app/api/health`
3. **AI Copilot**: Try the chat feature
4. **Payments**: Test the upgrade to Pro flow
5. **Cron Job**: Check Vercel logs the next day

## 🕒 Cron Job Configuration

The poll cleanup cron job runs **daily at midnight UTC**.

### Viewing Cron Logs

1. Go to your Vercel project dashboard
2. Click **Deployments** → Latest deployment
3. Click **Functions** → `api/cron/cleanup-polls`
4. View execution logs

### Manual Trigger (for testing)

You can manually trigger the cron function:

```bash
curl https://your-app.vercel.app/api/cron/cleanup-polls
```

> [!NOTE]
> **Hourly Cron Limitation**: Vercel's free Hobby plan only supports daily crons. For hourly execution, you need Vercel Pro ($20/month) or use a third-party service like [cron-job.org](https://cron-job.org).

## 🧪 Local Development with Vercel CLI

To test serverless functions locally:

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Link Your Project

```bash
vercel link
```

### 3. Pull Environment Variables

```bash
vercel env pull .env.local
```

### 4. Run Development Server

```bash
vercel dev
```

This will:
- Run your Vite frontend on `http://localhost:3000`
- Serve serverless functions at `http://localhost:3000/api/*`
- Hot reload both frontend and functions

## 🔄 Migrating from Local Server

If you were running `npm run server` locally:

1. **Stop** the Express server (`npm run server`)
2. Use `vercel dev` instead for local development
3. Frontend will automatically connect to the right endpoints

The API services (`aiService.ts`, `paymentService.ts`) now automatically:
- Use `http://localhost:3001` in development
- Use relative paths (`/api/*`) in production

## 🐛 Troubleshooting

### API Calls Failing in Production

**Problem**: Frontend can't reach the backend APIs.

**Solution**: 
- Verify all environment variables are set in Vercel dashboard
- Check Vercel function logs for errors
- Ensure CORS is not blocking requests (should be fine with same-origin)

### Firebase Connection Issues

**Problem**: "Firebase Admin credentials not found"

**Solution**:
- Verify `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` are set
- Make sure `FIREBASE_PRIVATE_KEY` includes the full key with line breaks
- Check Vercel function logs for specific error messages

### Razorpay Payments Not Working

**Problem**: Payment creation fails.

**Solution**:
- Use Razorpay **live keys** (not test keys) for production
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Check that your Razorpay account is activated for live payments

### Cron Job Not Running

**Problem**: Old polls are not being deleted.

**Solution**:
- Check Vercel's Cron dashboard for execution history
- Manually trigger: `curl https://your-app.vercel.app/api/cron/cleanup-polls`
- Verify Firebase credentials are working (cron job needs database access)

## 📊 Monitoring

### Function Logs

View real-time logs in Vercel dashboard:
1. Go to **Deployments** → Latest deployment
2. Click **Functions**
3. Select the function you want to monitor
4. View logs and performance metrics

### Usage Limits

Vercel Free (Hobby) Plan limits:
- **Bandwidth**: 100 GB/month
- **Function Execution**: 100 GB-hours/month
- **Serverless Function Duration**: 10 seconds max
- **Cron Jobs**: Once per day

If you exceed these, consider upgrading to Vercel Pro.

## 🎉 You're Done!

Your PollPath app is now fully deployed on Vercel with:
- ✅ Serverless AI Copilot
- ✅ Serverless Razorpay payments
- ✅ Daily poll cleanup cron job
- ✅ Auto-scaling infrastructure
- ✅ Global CDN for fast loading

Share your app: `https://your-app.vercel.app`

---

## 📝 Additional Notes

### Old Server File

The original `server.js` file is still in your repo but is **not used** in production. You can:
- Keep it for reference
- Delete it to clean up the repo
- Comment it for future reference

### Reverting to Express Server

If you ever want to revert to the Express server:
1. Uncomment the scripts in `package.json`
2. Update API services to always use `localhost:3001`
3. Deploy backend separately to Railway/Render

### Custom Domains

To add a custom domain:
1. Go to **Project Settings** → **Domains**
2. Add your domain
3. Update DNS records as shown
4. Vercel will auto-provision SSL certificates
