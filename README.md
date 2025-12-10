# PollPath

> **Build Your Personal Decision Engine**  
> A premium polling platform powered by AI, community insights, and stunning UI design.

## 🌟 Overview

PollPath is a modern, feature-rich polling application that transforms decision-making into an interactive, intelligent experience. It combines real-time voting, AI-powered recommendations, and a beautifully crafted interface to help users make informed choices through crowd wisdom.

## ✨ Core Features

### 📊 **Poll Management**

#### Poll Creation
- **Template-Based Creation**: 4 pre-built templates (City Move, Logo Feedback, Lunch Poll, Event Theme)
- **Custom Poll Builder**: Create polls from scratch with full customization
- **Live Preview Panel**: Real-time preview of how your poll will appear
- **Poll Type Support**:
  - Single choice polls
  - Multiple choice polls
  - Rating polls
- **Advanced Settings**:
  - Visibility (Public/Unlisted)
  - Identity (Named/Anonymous posting)
  - Expiration duration (24h default, extended for Pro users)
  - Comments toggle
  - Results visibility (Always/After Vote/After Close)
  - Custom tags and categorization
  - Image uploads
- **Draft System**: Save polls as drafts before publishing
- **Pro Features**: Extended poll duration beyond 24 hours for Pro subscribers

#### Poll Discovery & Exploration
- **Smart Feed System**:
  - Trending (sorted by vote count)
  - Newest (recently created)
  - Closing Soon (ending soonest)
- **Category Filtering**: Filter by tags (travel, tech, food, design, etc.)
- **Advanced Filters**:
  - Public polls feed
  - Private polls (Pro users only)
  - Saved polls collection
- **Bento Grid Layout**: Dynamic, visually appealing card layout
- **Infinite Scroll**: Loads 12 polls at a time with automatic pagination
- **Search Functionality**: Find polls by keywords
- **Empty States**: Helpful UI when no polls match filters
- **Skeleton Loading**: Smooth loading experience with skeleton screens

#### Poll Voting & Interaction
- **Single Vote System**: One vote per user per poll
- **Vote Changing**: Users can change their vote at any time
- **Real-time Updates**: Instant vote count and percentage updates
- **Vote Tracking**: Backend tracks voters per option
- **Authenticated Voting**: Requires sign-in before voting
- **Result Visualization**: 
  - Percentage bars
  - Vote counts
  - Progress animations
- **Poll Sharing**: Copy shareable poll links
- **Direct Poll Access**: Open polls via URL query parameters (`?poll=POLL_ID`)
- **Save Polls**: Bookmark polls for later (localStorage)
- **Delete Polls**: Creators can delete their own polls
- **Poll Modal**: Full-screen detailed view with voting interface

### 🤖 **AI Copilot (PollPath Copilot)**

#### Intelligent Conversation
- **Powered by Gemini 2.5 Flash**: Google's latest AI model
- **Context-Aware Responses**: Understands conversation history
- **Page Context Integration**: Aware of current page/route
- **Natural Language Processing**: Conversational interface

#### Smart Poll Discovery
- **Keyword Extraction**: Filters stop words and question words
- **Content-Based Matching**: Scores polls based on:
  - Question matches (5 points)
  - Tag matches (3 points)
  - Option matches (2 points)
- **Minimum Relevance Threshold**: Score ≥10 required
- **Fallback Full-Text Search**: When no keyword matches found
- **Top 5 Results**: Shows most relevant polls
- **Poll Cards**: Mini cards showing question, top options, votes, tags

#### Poll Creation Assistance
- **Automatic Poll Extraction**: Converts questions to poll structure
- **Smart Option Generation**: Suggests relevant options
- **Tag Recommendations**: AI-suggested tags
- **In-Chat Poll Creator**: Create polls directly from chat
- **One-Click Creation**: Pre-filled form from AI suggestions

#### Web Search Integration
- **DuckDuckGo API**: Fetches web information when needed
- **Information Synthesis**: Provides insights when no polls exist
- **Actionable Recommendations**: Gives clear guidance based on data

#### Chat Features
- **Floating Chat Button**: Accessible from any page
- **Smooth Animations**: Framer Motion powered
- **Message History**: Maintains conversation context (last 6 messages)
- **Typing Indicators**: Shows AI is processing
- **Suggested Questions**: Quick-start prompts
- **Action Buttons**: "Create Poll", "View Poll", etc.
- **Poll Linking**: Click poll cards to open full modal
- **Auto-scroll**: Smooth scroll to latest messages
- **Keyboard Support**: Enter to send, with input focus management

### 🔐 **Authentication System**

#### Multiple Auth Methods
- **Email/Password**: Traditional signup/signin
- **Google OAuth**: One-click Google sign-in
- **GitHub OAuth**: Developer-friendly GitHub sign-in
- **Phone Authentication**: SMS-based login with OTP
- **Firebase Auth**: Secure backend authentication

#### Auth Features
- **Modular Components**:
  - `SocialSignInButtons` - OAuth providers
  - `EmailPasswordForm` - Email/password auth
  - `PhoneAuthForm` - Phone number authentication
- **reCAPTCHA Integration**: Bot protection for phone auth
- **Persistent Sessions**: Automatic session management
- **Auth Context**: Global authentication state
- **Protected Actions**: Vote/create polls require authentication
- **User Menu**: Profile dropdown with sign-out
- **Auth Modal**: Beautiful, responsive authentication modal
- **Auto-auth Before Actions**: Prompts login before voting/creating

#### User Management
- **User Profiles**: Firestore-based user documents
- **Pro Status Tracking**: isPro, proPlan, proSince fields
- **Display Names**: Uses displayName or email username
- **Creator Attribution**: Polls show creator names or "Anonymous"
- **User-specific Feeds**: "My Private Polls" for Pro users
- **Session Persistence**: Remembers logged-in state

### 💎 **Pro Subscription (Razorpay Integration)**

#### Payment Flow
- **Razorpay Checkout**: Native payment gateway
- **Order Creation**: Backend creates secure Razorpay orders
- **Payment Verification**: SHA256 signature validation
- **Firestore Updates**: Automatic Pro status activation
- **Payment Tracking**: Stores order ID, payment ID, signature

#### Pro Features
- **Unlisted Polls**: Create private, unlisted polls (Pro only)
- **Extended Duration**: Polls last longer than 24 hours (Pro only)
- **Pro Badge**: Visual indicators for Pro users
- **Private Poll Feed**: Access to personal unlisted polls
- **Pricing Display**: ₹99/month (configurable via env)

#### Payment Components
- **Pro Paywall Modal**: Triggered when accessing Pro features
- **Success Modal**: Confirmation after successful payment
- **Payment Service**: Handles order creation and verification
- **Feature Gating**: Automatically shows paywall for Pro-only features
- **Auto-refresh**: Updates Pro status after payment

#### Subscription Management
- **Real-time Status**: Context-based Pro status check
- **Server-side Validation**: Backend verifies all payments
- **Auto-delete Protection**: Pro polls exempt from 24h deletion cron

### 🎨 **UI/UX Features**

#### Design System
- **Brand Colors**: Custom color palette (brand-50 to brand-900)
- **Typography**: Serif headings, sans-serif body
- **Glassmorphism**: Backdrop blur effects throughout
- **Shadows & Depth**: Layered shadow system
- **Border Radius**: Consistent 24px/32px rounded corners
- **Responsive Design**: Mobile-first, fully responsive

#### Animations & Interactions
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Scroll Animations**: Fade-in effects on scroll
- **Hover States**: Interactive hover effects on all clickable elements
- **Loading States**: Skeleton screens, spinners, progress indicators
- **Toast Notifications**: Real-time feedback (react-hot-toast)
- **Modal Animations**: Scale and fade transitions
- **Carousel Effects**: Smooth template carousel
- **3D Effects**: Transform effects on hero poll card
- **Button Highlights**: Shadow-based hover highlights

#### Components & Layout
- **Responsive Navbar**:
  - Sticky positioning
  - Glassmorphism on scroll
  - Centered nav pills (desktop)
  - Hamburger menu (mobile)
  - User avatar dropdown
- **Hero Section**:
  - Background video ambience
  - Gradient text animation (shine effect)
  - Mock poll carousel with 3D transform
  - Progressive blur overlay
- **Footer**:
  - Pricing table (3 tiers)
  - Testimonials carousel
  - Contact form
  - Pop cards (features)
  - Social links
- **Sidebar** (Explore page):
  - Sticky positioned
  - Category filters
  - View toggles (Public/Private/Saved)
  - Poll count badges
  - Hidden on mobile
- **Bento Grid**: Dynamic masonry-style poll cards
- **Feed Cards**:
  - Tag badges
  - Vote counts
  - Creator info
  - Time posted
  - Save button
  - Anonymous indicator
- **Scroll Blur**: Progressive blur at page bottom
- **Empty States**: Custom illustrations for no results

#### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Visible focus indicators
- **ARIA Labels**: Screen reader friendly
- **Semantic HTML**: Proper HTML5 structure
- **Alt Text**: Images have descriptions
- **Color Contrast**: WCAG compliant

### 🗄️ **Backend Architecture**

#### Express Server (`server.js`)
- **Port**: 3001 (development)
- **CORS Enabled**: Cross-origin requests allowed
- **Middleware**: JSON body parsing
- **Health Check**: `/api/health` endpoint

#### API Endpoints

**AI Copilot**
- `POST /api/copilot`
  - Accepts: message, history, pageContext
  - Returns: AI response, poll cards, action suggestions
  - Features: Poll search, web search fallback, poll extraction

**Payments**
- `POST /api/payments/create-order`
  - Creates Razorpay order
  - Returns: orderId, amount, currency, keyId
- `POST /api/payments/verify`
  - Verifies payment signature
  - Updates user Pro status in Firestore
  - Returns: success status

#### Background Jobs
- **Cron Schedule**: Every hour (`0 * * * *`)
- **Auto-delete**: Removes free-tier polls older than 24 hours
- **Soft Delete**: Sets poll status to 'deleted'
- **Pro Exemption**: Pro user polls never auto-deleted

#### Firebase Admin
- **Firestore Access**: Server-side database operations
- **Collections**: `polls`, `users`
- **Indexes**: Automatic query optimization
- **Timestamps**: Server-side timestamp generation

### 📦 **Data Models**

#### Poll Schema
```typescript
{
  id: string (auto-generated)
  question: string
  type: 'single' | 'multiple' | 'rating'
  options: PollOption[]
  visibility: 'public' | 'unlisted'
  identity: 'anonymous' | 'named'
  closesAt: Timestamp
  allowComments: boolean
  resultsVisibility: 'always' | 'afterVote' | 'afterClose'
  tags: string[]
  imageUrl: string | null
  totalVotes: number
  status: 'draft' | 'published' | 'closed' | 'deleted'
  createdAt: Timestamp
  updatedAt: Timestamp
  creatorId: string
  creatorName: string
  creatorEmail: string
  voters: { [optionIndex: number]: string[] }
  ownerIsPro: boolean
}
```

#### PollOption Schema
```typescript
{
  label: string
  votesCount: number
}
```

#### User Schema
```typescript
{
  email: string
  displayName: string
  isPro: boolean
  proPlan: string | null
  proSince: Timestamp | null
  razorpayCustomerId: string (optional)
  razorpayPaymentId: string (optional)
  razorpayOrderId: string (optional)
  razorpaySignature: string (optional)
  createdAt: Timestamp
}
```

### 🔧 **Configuration & Environment**

#### Required Environment Variables
```env
# Firebase Configuration (Frontend)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Firebase Admin (Backend)
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Gemini AI
GEMINI_API_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
PRO_PLAN_AMOUNT=9900  # ₹99 in paise
PRO_PLAN_CURRENCY=INR
PRO_PLAN_NAME=pro-monthly
```

## 🛠️ **Technology Stack**

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **React Markdown** - Markdown rendering

### Backend
- **Express 5** - Web server
- **Node.js** - Runtime
- **Firebase Admin** - Server-side Firebase
- **Razorpay SDK** - Payment processing
- **Google Generative AI** - AI integration
- **Node Cron** - Scheduled jobs
- **CORS** - Cross-origin support
- **Crypto** - Signature verification

### Database & Auth
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
  - Google OAuth
  - GitHub OAuth
  - Email/Password
  - Phone (SMS)

### Infrastructure
- **Vercel** - Deployment platform (configured)
- **Vercel Serverless Functions** - API routes
- **Concurrently** - Run dev server + backend

## 📁 **Project Structure**

```
pollpath/
├── api/                      # Serverless API routes (Vercel)
│   ├── _lib/                 # Shared utilities
│   ├── copilot.js            # AI Copilot endpoint
│   ├── cron/                 # Cron job handlers
│   ├── health.js             # Health check endpoint
│   └── payments/             # Payment endpoints
├── components/               # React components
│   ├── AuthModal/            # Authentication modal components
│   │   ├── EmailPasswordForm.tsx
│   │   ├── PhoneAuthForm.tsx
│   │   └── SocialSignInButtons.tsx
│   ├── CreatePoll/           # Poll creation components
│   │   ├── CreatePollTabs.tsx
│   │   ├── PollFormFields.tsx
│   │   ├── PollPreview.tsx
│   │   ├── PollSettingsGrid.tsx
│   │   ├── PollTemplateCard.tsx
│   │   ├── PollTemplateIcon.tsx
│   │   └── TemplateCarousel.tsx
│   ├── ExplorePolls/         # Poll exploration components
│   │   ├── BentoGrid.tsx
│   │   ├── BottomCTA.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FeedCard.tsx
│   │   ├── FilterDropdown.tsx
│   │   ├── InfiniteScrollFeed.tsx
│   │   ├── LoadingState.tsx
│   │   ├── PollSection.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   └── SkeletonFeed.tsx
│   ├── Features/             # Landing page feature sections
│   │   ├── FeatureGrid.tsx
│   │   ├── Graphics/         # Feature graphics
│   │   ├── HowItWorks.tsx
│   │   ├── RollingQuestion.tsx
│   │   └── UseCases.tsx
│   ├── Footer/               # Footer components
│   │   ├── FooterMain.tsx
│   │   ├── PopCard.tsx
│   │   ├── Pricing.tsx
│   │   ├── ReachOut.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── Testimonials.tsx
│   ├── InChatPollCreator/    # In-chat poll creation
│   ├── MockPoll/             # Hero section mock poll
│   ├── PollModal/            # Voting modal components
│   ├── ui/                   # Reusable UI components
│   ├── AuthModal.tsx
│   ├── ChatMessage.tsx
│   ├── ChatPanel.tsx
│   ├── CreatePoll.tsx
│   ├── ExplorePolls.tsx
│   ├── Features.tsx
│   ├── FloatingChatButton.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── MiniPollCard.tsx
│   ├── MockPoll.tsx
│   ├── Navbar.tsx
│   ├── PollModal.tsx
│   ├── ProPaywallModal.tsx
│   ├── ProSuccessModal.tsx
│   └── ScrollBlur.tsx
├── constants/                # Application constants
│   ├── featureGraphicsData.ts
│   ├── mockPollData.ts
│   ├── pollDefaults.ts
│   ├── pollTemplates.ts
│   ├── pricingData.ts
│   └── testimonialData.ts
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context
├── lib/                      # Library configurations
│   └── firebase.ts           # Firebase initialization
├── public/                   # Static assets
├── services/                 # API services
│   ├── aiService.ts          # AI Copilot service
│   ├── paymentService.ts     # Razorpay service
│   └── pollService.ts        # Poll CRUD operations
├── App.tsx                   # Main app component
├── index.tsx                 # App entry point
├── types.ts                  # TypeScript definitions
├── server.js                 # Express backend
├── vercel.json               # Vercel configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled
- Razorpay account (for payments)
- Google AI Studio API key (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pollpath
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all required credentials

4. **Set up Firebase**
   - Create a Firebase project
   - Enable Firestore
   - Enable Authentication (Email, Google, GitHub, Phone)
   - Create a service account for Admin SDK
   - Download credentials

5. **Set up Razorpay**
   - Create a Razorpay account
   - Get API keys from dashboard
   - Configure webhook (optional)

6. **Run development server**
   ```bash
   npm run dev
   ```
   This starts both:
   - Vite dev server (frontend) on port 5173
   - Express backend on port 3001

### Building for Production

```bash
npm run build
```

### Deployment

The project is configured for Vercel:
```bash
vercel deploy
```

## 📝 **Minor Features & Details**

### UI Polish
- **Custom Cursor**: Selection color customization
- **Smooth Scrolling**: CSS scroll-behavior
- **Performance**: Lazy loading, code splitting
- **Error Handling**: Graceful error messages
- **Loading States**: Consistent loading indicators
- **Optimistic Updates**: UI updates before backend confirmation
- **Focus Management**: Auto-focus on inputs
- **Keyboard Shortcuts**: Enter to submit forms
- **Copy to Clipboard**: Share functionality
- **Local Storage**: Saved polls persistence
- **URL Parameters**: Deep linking to polls
- **Timestamp Display**: Relative time ("2 days ago")
- **Vote Percentages**: Real-time calculation
- **Anonymous Badge**: Visual indicator for anonymous posts
- **Pro Badge**: Crown icon for Pro users
- **Tag Pills**: Color-coded category tags
- **Mobile Menu**: Hamburger navigation
- **Sticky Headers**: Navbar stays on scroll
- **Bottom CTA**: Encourage poll creation
- **Infinite Scroll**: Load more on scroll

### Developer Experience
- **TypeScript**: Full type safety
- **Component Modularity**: Reusable components
- **Service Layer**: Centralized API calls
- **Context API**: Global state management
- **Custom Hooks**: Reusable logic
- **Constants Files**: Centralized configuration
- **Error Boundaries**: Graceful error handling
- **Console Logging**: Detailed backend logs
- **Dev/Prod Modes**: Environment-based configuration
- **Hot Reload**: Instant development feedback

### Security
- **Firebase Rules**: Database security (configure in Firebase console)
- **Authentication Required**: Protected routes
- **CSRF Protection**: Razorpay signature verification
- **Environment Variables**: Secrets management
- **CORS Configuration**: Controlled access
- **Input Validation**: Form validation throughout
- **XSS Protection**: React's built-in protection
- **Sanitized Markdown**: Safe markdown rendering

### Performance
- **Code Splitting**: Dynamic imports
- **Lazy Loading**: On-demand component loading
- **Image Optimization**: Proper sizing and formats
- **Caching**: Browser caching strategies
- **Debouncing**: Search input optimization
- **Pagination**: 12 polls per load
- **Firestore Queries**: Indexed and optimized
- **Server-side Timestamps**: Consistent timing

## 🎯 **Key User Flows**

1. **Create a Poll**
   - Sign in → Create Poll → Choose template or scratch → Fill form → Publish
   - Or: Ask AI Copilot → AI suggests poll → Create in chat

2. **Vote on a Poll**
   - Browse Explore → Click poll card → Vote → See results

3. **Use AI Copilot**
   - Click floating button → Ask question → View related polls → Get insights

4. **Upgrade to Pro**
   - Try Pro feature → See paywall → Pay via Razorpay → Unlock features

5. **Share a Poll**
   - Open poll modal → Click share → Copy link → Share anywhere

## 📊 **Statistics**

- **Total Components**: 65+ React components
- **API Endpoints**: 4 (copilot, create-order, verify, health)
- **Auth Providers**: 4 (Email, Google, GitHub, Phone)
- **Poll Templates**: 4 pre-built templates
- **Database Collections**: 2 (polls, users)
- **Cron Jobs**: 1 (auto-delete old polls)
- **Environment Variables**: 13+ required
- **Dependencies**: 15 production, 5 dev
- **Lines of Code**: ~10,000+ (estimated)

## 🤝 **Contributing**

This appears to be a personal/educational project. If contributions are accepted:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

## 📄 **License**

[Specify your license here]

## 🙏 **Credits**

- **UI Inspiration**: Modern design trends, glassmorphism
- **Icons**: Lucide React
- **Fonts**: System fonts (serif/sans-serif)
- **AI**: Google Gemini 2.5 Flash
- **Payment**: Razorpay
- **Database**: Firebase Firestore
- **Deployment**: Vercel

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
