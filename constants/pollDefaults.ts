import { Poll } from '../types';

// Uniform input styles for light mode consistency
export const INPUT_BASE_CLASSES = "w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-900/5 focus:border-brand-900 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400";

// Default form data for new polls
export const DEFAULT_POLL_FORM: Partial<Poll> = {
    question: '',
    type: 'single',
    options: [
        { label: '', votesCount: 0 },
        { label: '', votesCount: 0 }
    ],
    visibility: 'public',
    identity: 'named',
    voters: {},
    allowComments: true,
    resultsVisibility: 'always',
    tags: [],
    totalVotes: 0,
    status: 'published'
};

// Duration options for poll
export const DURATION_OPTIONS = [
    { value: 1, label: '1 Hour' },
    { value: 6, label: '6 Hours' },
    { value: 12, label: '12 Hours' },
    { value: 24, label: '24 Hours (Free tier max)' },
    { value: 48, label: '48 Hours', proOnly: true },
    { value: 72, label: '3 Days', proOnly: true },
    { value: 168, label: '1 Week', proOnly: true },
    { value: 720, label: '1 Month', proOnly: true },
];
