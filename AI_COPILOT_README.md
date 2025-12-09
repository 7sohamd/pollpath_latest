# Running PollPath with AI Copilot

## Prerequisites

1. **Node.js** installed
2. **Firebase project** set up with Firestore
3. **Gemini API key** from Google AI Studio

## Environment Setup

1. Copy `.env.template` to `.env.local`:
   ```bash
   cp .env.template .env.local
   ```

2. Fill in your credentials in `.env.local`:
   - Firebase: Get from Firebase Console > Project Settings
   - Gemini API: Get from https://ai.google.dev/
   - Firebase Admin (for backend): Download service account JSON from Firebase Console > Project Settings > Service Accounts

## Installation

```bash
npm install
```

## Running the Application

### Option 1: Run Both Services Together (Recommended)

```bash
npm run dev:all
```

This starts:
- **Frontend** on http://localhost:3000
- **Backend** on http://localhost:3001

### Option 2: Run Services Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

## Using the AI Copilot

1. Open http://localhost:3000 in your browser
2. Look for the floating chat button in the bottom-right corner
3. Click to open the chat panel
4. Ask questions like:
   - "Which programming language should I learn?"
   - "Should I start a blog or YouTube channel?"
   - "Hyderabad or Pune?"

The AI will:
- Search for similar polls from the PollPath community
- Show poll results and insights
-Provide recommendations based on poll data
- Fall back to web search if no polls are found

## Troubleshooting

**"Backend not responding" error:**
- Make sure the backend server is running (`npm run server`)  
- Check that `GEMINI_API_KEY` is set in `.env.local`
- Check that Firebase Admin credentials are correct

**No polls showing up:**
- Make sure Firestore is set up correctly
- Try creating a poll first via the "Create" page

**Chat button not visible:**
- Check browser console for errors
- Make sure all dependencies are installed (`npm install`)
