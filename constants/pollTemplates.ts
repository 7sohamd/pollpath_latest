import { MapPin, Palette, Utensils, GraduationCap } from 'lucide-react';
import { PollTemplate } from '../types';

export const POLL_TEMPLATES: PollTemplate[] = [
    {
        name: "City Move",
        description: "Compare cities, living costs, and vibes to find your perfect next home.",
        icon: MapPin,
        data: {
            question: "Which city should I move to?",
            type: 'single',
            options: [
                { label: "Hyderabad", votesCount: 0 },
                { label: "Pune", votesCount: 0 },
                { label: "Bangalore", votesCount: 0 }
            ],
            tags: ["travel", "life"],
        }
    },
    {
        name: "Logo Feedback",
        description: "Gather professional feedback on your design concepts to choose the best brand identity.",
        icon: Palette,
        data: {
            question: "Which logo concept fits better?",
            type: 'single',
            options: [
                { label: "Concept A (Minimal)", votesCount: 0 },
                { label: "Concept B (Bold)", votesCount: 0 }
            ],
            tags: ["design", "branding"],
        }
    },
    {
        name: "Lunch Poll",
        description: "Settle the daily food debate with your team by voting on cuisines and restaurants.",
        icon: Utensils,
        data: {
            question: "What should we order for lunch?",
            type: 'multiple',
            options: [
                { label: "Pizza", votesCount: 0 },
                { label: "Biryani", votesCount: 0 },
                { label: "Sushi", votesCount: 0 }
            ],
            tags: ["food", "fun"],
        }
    },
    {
        name: "Event Theme",
        description: "Collaborate on the perfect vibe for your upcoming party, fest, or gathering.",
        icon: GraduationCap,
        data: {
            question: "Theme for the college fest?",
            type: 'single',
            options: [
                { label: "Neon Night", votesCount: 0 },
                { label: "Bollywood Retro", votesCount: 0 },
                { label: "Masquerade", votesCount: 0 }
            ],
            tags: ["events", "college"],
        }
    }
];
