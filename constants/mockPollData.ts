export interface PollData {
    id: string;
    author: string;
    time: string;
    question: string;
    desc: string;
    options: { id: string; label: string; votes: number }[];
    totalVotes: number;
}

export const POLL_DATA: PollData[] = [
    {
        id: 'poll-1',
        author: 'Alex Sharma',
        time: '2h ago',
        question: 'Moving for work ✈️',
        desc: 'Frontend dev seeking tech communities.',
        options: [
            { id: 'opt1', label: 'Hyderabad', votes: 1240 },
            { id: 'opt2', label: 'Pune', votes: 1150 },
        ],
        totalVotes: 2390
    },
    {
        id: 'poll-2',
        author: 'Design Team',
        time: '15m ago',
        question: 'New Logo Concept 🎨',
        desc: 'Which vibe fits our rebrand better?',
        options: [
            { id: 'opt1', label: 'Minimalist (A)', votes: 840 },
            { id: 'opt2', label: 'Playful (B)', votes: 320 },
            { id: 'opt3', label: 'Abstract (C)', votes: 550 },
        ],
        totalVotes: 1710
    },
    {
        id: 'poll-3',
        author: 'Product Mgr',
        time: '5m ago',
        question: 'Next Feature Priority 🚀',
        desc: 'What should we ship in Q3?',
        options: [
            { id: 'opt1', label: 'Dark Mode', votes: 2100 },
            { id: 'opt2', label: 'API Access', votes: 800 },
        ],
        totalVotes: 2900
    }
];
