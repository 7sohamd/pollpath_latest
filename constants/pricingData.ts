import { PricingTier } from '../types';

export const PRICING_PLANS: PricingTier[] = [
    {
        name: "Free",
        price: "$0",
        description: "For individuals & hobbyists.",
        features: [
            "Unlimited public polls",
            "1000 votes per poll",
            "Standard analytics",
            "Ad-supported",
            "Community support"
        ],
        cta: "Start for Free"
    },
    {
        name: "Pro",
        price: "$9",
        description: "For creators & power users.",
        features: [
            "Private (link-only) polls",
            "Unlimited votes",
            "Deep demographics",
            "Export CSV data",
            "No ads",
            "Priority support"
        ],
        cta: "Go Pro",
        popular: true
    }
];
