import { Twitter, Linkedin, Facebook, Instagram, MessageCircle, Globe, Slack, Github, Dribbble } from 'lucide-react';

export type TestimonialSize = 'sm' | 'md' | 'lg';

export interface Testimonial {
    name: string;
    handle: string;
    role: string;
    platform: string;
    icon: any;
    color: string;
    quote: string;
    size: TestimonialSize;
}

export interface BackgroundTestimonial {
    name: string;
    handle: string;
    role: string;
    quote: string;
    icon: any;
    color: string;
    top: string;
    left: string;
}

export const testimonialsData: Testimonial[] = [
    {
        name: "Sarah Jenkins",
        handle: "@sarah_design",
        role: "Product Designer",
        platform: "twitter",
        icon: Twitter,
        color: "text-sky-500",
        quote: "Finally stopped arguing about color palettes. We just asked PollPath and the community decided in 10 mins.",
        size: "md"
    },
    {
        name: "David Chen",
        handle: "@dchen_tech",
        role: "Founder",
        platform: "linkedin",
        icon: Linkedin,
        color: "text-blue-700",
        quote: "Used it to validate a feature idea. Saved us weeks of dev time.",
        size: "lg"
    },
    {
        name: "Elena R.",
        handle: "@elena_travels",
        role: "Travel Blogger",
        platform: "instagram",
        icon: Instagram,
        color: "text-pink-600",
        quote: "500 people voted for Bali over Thailand. Bali it is! ✈️",
        size: "sm"
    },
    {
        name: "Marcus T.",
        handle: "@marcus_builds",
        role: "Indie Hacker",
        platform: "twitter",
        icon: Twitter,
        color: "text-sky-500",
        quote: "The 'Share Everywhere' feature is a game changer for getting quick feedback on prototypes.",
        size: "md"
    },
    {
        name: "Priya Patel",
        handle: "@priya_edu",
        role: "Student Lead",
        platform: "facebook",
        icon: Facebook,
        color: "text-blue-600",
        quote: "Organized our entire college fest theme using this. Zero arguments.",
        size: "sm"
    },
    {
        name: "James Wilson",
        handle: "@jwilson_ux",
        role: "UX Researcher",
        platform: "linkedin",
        icon: Linkedin,
        color: "text-blue-700",
        quote: "Data export helped me visualize user preferences for my case study. Brilliant tool.",
        size: "md"
    },
    {
        name: "Sofia Martinez",
        handle: "@sofia_creates",
        role: "Content Creator",
        platform: "instagram",
        icon: Instagram,
        color: "text-pink-600",
        quote: "My audience helped me pick my next video topic. Got 2k votes in 3 hours!",
        size: "lg"
    },
    {
        name: "Alex Kim",
        handle: "@alexk_dev",
        role: "Software Engineer",
        platform: "github",
        icon: Github,
        color: "text-gray-800",
        quote: "Perfect for sprint planning votes. The team actually agrees now.",
        size: "sm"
    },
    {
        name: "Maya Thompson",
        handle: "@maya_marketing",
        role: "Marketing Lead",
        platform: "linkedin",
        icon: Linkedin,
        color: "text-blue-700",
        quote: "Campaign choices used to take weeks. Now we decide in days with real data.",
        size: "md"
    },
    {
        name: "Carlos Rivera",
        handle: "@carlos_startup",
        role: "Startup Founder",
        platform: "twitter",
        icon: Twitter,
        color: "text-sky-500",
        quote: "Validated our product pivot with 1000+ votes. Best decision we made.",
        size: "lg"
    }
];

export const backgroundTestimonialsData: BackgroundTestimonial[] = [
    { name: "Tom H.", handle: "@tom_h", role: "Dev", quote: "Simple and clean.", icon: Twitter, color: "text-sky-500", top: "5%", left: "2%" },
    { name: "Lisa K.", handle: "@lisa_ux", role: "Designer", quote: "Love the UI.", icon: Instagram, color: "text-pink-500", top: "8%", left: "92%" },
    { name: "Raj P.", handle: "@raj_pm", role: "PM", quote: "Great insights.", icon: Linkedin, color: "text-blue-700", top: "85%", left: "3%" },
    { name: "Anna S.", handle: "@anna_art", role: "Creator", quote: "My followers love it.", icon: Globe, color: "text-gray-600", top: "88%", left: "88%" },
    { name: "Mike R.", handle: "@mike_r", role: "Manager", quote: "Effective.", icon: MessageCircle, color: "text-green-500", top: "35%", left: "1%" },
    { name: "Joana", handle: "@jo_tweets", role: "Writer", quote: "No more debates.", icon: Twitter, color: "text-sky-500", top: "55%", left: "96%" },
    { name: "Sam D.", handle: "@sam_dev", role: "Engineer", quote: "Fastest way to decide.", icon: Github, color: "text-gray-800", top: "12%", left: "15%" },
    { name: "Kate M.", handle: "@kate_mkt", role: "Marketer", quote: "A/B testing made easy.", icon: Slack, color: "text-purple-500", top: "92%", left: "75%" },
    { name: "Leo F.", handle: "@leo_f", role: "Artist", quote: "Beautiful interface.", icon: Dribbble, color: "text-pink-600", top: "40%", left: "97%" },
    { name: "Nina W.", handle: "@nina_w", role: "Student", quote: "So helpful.", icon: Instagram, color: "text-pink-500", top: "3%", left: "70%" },
    { name: "Chris B.", handle: "@chris_b", role: "Founder", quote: "Essential tool.", icon: Twitter, color: "text-sky-500", top: "95%", left: "25%" },
    { name: "Alex G.", handle: "@alex_g", role: "User", quote: "Highly recommend.", icon: Globe, color: "text-blue-600", top: "50%", left: "5%" },
    { name: "Morgan L.", handle: "@morgan_l", role: "Director", quote: "Saves hours.", icon: Linkedin, color: "text-blue-700", top: "90%", left: "50%" },
    { name: "Casey R.", handle: "@casey_r", role: "Freelancer", quote: "Clients love it.", icon: MessageCircle, color: "text-green-500", top: "75%", left: "82%" },
    { name: "Jamie T.", handle: "@jamie_t", role: "Prod", quote: "Quick validation.", icon: Slack, color: "text-purple-500", top: "97%", left: "12%" },
    { name: "Riley K.", handle: "@riley_k", role: "UX", quote: "Clear data.", icon: Dribbble, color: "text-pink-600", top: "82%", left: "94%" },
    { name: "Jordan P.", handle: "@jordan_p", role: "Teacher", quote: "Engaging.", icon: Twitter, color: "text-sky-500", top: "65%", left: "10%" },
    { name: "Taylor S.", handle: "@taylor_s", role: "Blogger", quote: "Fun to use.", icon: Instagram, color: "text-pink-500", top: "70%", left: "68%" },
    { name: "Quinn A.", handle: "@quinn_a", role: "Musician", quote: "Fan feedback.", icon: Globe, color: "text-gray-600", top: "98%", left: "60%" },
    { name: "Avery M.", handle: "@avery_m", role: "Chef", quote: "Menu planning.", icon: Facebook, color: "text-blue-600", top: "78%", left: "38%" },
    { name: "Blake H.", handle: "@blake_h", role: "Analyst", quote: "Data-driven decisions.", icon: Linkedin, color: "text-blue-700", top: "18%", left: "8%" },
    { name: "Drew P.", handle: "@drew_p", role: "Coach", quote: "Team consensus.", icon: MessageCircle, color: "text-green-500", top: "25%", left: "93%" },
    { name: "Sage L.", handle: "@sage_l", role: "Consultant", quote: "Client approved!", icon: Twitter, color: "text-sky-500", top: "45%", left: "4%" },
    { name: "Rowan K.", handle: "@rowan_k", role: "Developer", quote: "Seamless integration.", icon: Github, color: "text-gray-800", top: "60%", left: "91%" },
    { name: "River T.", handle: "@river_t", role: "Designer", quote: "Clean aesthetics.", icon: Dribbble, color: "text-pink-600", top: "30%", left: "11%" },
    { name: "Phoenix M.", handle: "@phoenix_m", role: "Strategist", quote: "Game changer.", icon: Linkedin, color: "text-blue-700", top: "93%", left: "65%" },
    { name: "Skyler R.", handle: "@skyler_r", role: "Writer", quote: "Reader feedback.", icon: Globe, color: "text-gray-600", top: "7%", left: "85%" },
    { name: "Harper W.", handle: "@harper_w", role: "Photographer", quote: "Perfect for shoots.", icon: Instagram, color: "text-pink-500", top: "22%", left: "78%" },
    { name: "Dakota F.", handle: "@dakota_f", role: "Entrepreneur", quote: "Validated my idea.", icon: Twitter, color: "text-sky-500", top: "48%", left: "89%" },
    { name: "Logan B.", handle: "@logan_b", role: "Researcher", quote: "Accurate results.", icon: Slack, color: "text-purple-500", top: "38%", left: "7%" },
    { name: "Ember S.", handle: "@ember_s", role: "Influencer", quote: "My community loves it.", icon: Instagram, color: "text-pink-500", top: "68%", left: "15%" },
    { name: "Ash V.", handle: "@ash_v", role: "Editor", quote: "Story direction.", icon: Facebook, color: "text-blue-600", top: "87%", left: "20%" },
    { name: "Jules C.", handle: "@jules_c", role: "Producer", quote: "Crowd wisdom.", icon: MessageCircle, color: "text-green-500", top: "15%", left: "88%" },
    { name: "Kai N.", handle: "@kai_n", role: "Architect", quote: "Design decisions.", icon: Dribbble, color: "text-pink-600", top: "58%", left: "72%" },
    { name: "Storm D.", handle: "@storm_d", role: "Gamer", quote: "Community chose.", icon: Twitter, color: "text-sky-500", top: "80%", left: "57%" }
];
