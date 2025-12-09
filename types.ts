import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// --- Firestore Data Models ---

export interface PollOption {
  label: string;
  votesCount: number;
}

export interface Poll {
  id?: string;
  question: string;
  type: 'single' | 'multiple' | 'rating';
  options: PollOption[];
  visibility: 'public' | 'unlisted';
  identity: 'anonymous' | 'named';
  closesAt: any; // Using any for mock Timestamp/Date compatibility
  allowComments: boolean;
  resultsVisibility: 'always' | 'afterVote' | 'afterClose';
  tags: string[];
  imageUrl: string | null;
  totalVotes: number;
  status: 'draft' | 'published' | 'closed' | 'deleted';
  createdAt: any;
  updatedAt: any;
  // Creator information
  creatorId?: string;
  creatorName?: string;
  creatorEmail?: string;
  // Voting tracking: voters[optionIndex] = array of user IDs
  voters?: { [optionIndex: number]: string[] };
  // Pro status tracking
  ownerIsPro?: boolean;
}

export interface PollTemplate {
  name: string;
  description: string;
  icon: any;
  data: Partial<Poll>;
}

// --- Pro Subscription Types ---

export interface UserProData {
  isPro: boolean;
  proPlan: string | null;
  proSince: any; // Timestamp
  razorpayCustomerId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface RazorpayOrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpayPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// --- AI Copilot Types ---

export interface SuggestedPoll {
  question: string;
  options: string[];
  suggestedTags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  pollCards?: MiniPollData[];
  actionSuggestions?: ActionSuggestion[];
  suggestedPoll?: SuggestedPoll;
}

export interface MiniPollData {
  id: string;
  question: string;
  options: {
    label: string;
    votesCount: number;
    percentage: number;
  }[];
  totalVotes: number;
  tags: string[];
}

export interface CopilotResponse {
  text: string;
  pollCards: MiniPollData[];
  actionSuggestions: ActionSuggestion[];
  suggestedPoll?: SuggestedPoll;
}

export interface ActionSuggestion {
  type: 'createPoll' | 'openPoll' | 'createPollInChat';
  label: string;
  payload: {
    question?: string;
    options?: string[];
    suggestedTags?: string[];
    pollId?: string;
  };
}