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
  status: 'draft' | 'published' | 'closed';
  createdAt: any;
  updatedAt: any;
  // Creator information
  creatorId?: string;
  creatorName?: string;
  creatorEmail?: string;
  // Voting tracking: voters[optionIndex] = array of user IDs
  voters?: { [optionIndex: number]: string[] };
}

export interface PollTemplate {
  name: string;
  description: string;
  icon: any;
  data: Partial<Poll>;
}