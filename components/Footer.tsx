
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';
import { Plus, Minus, Check, Twitter, Linkedin, Facebook, Instagram, MessageCircle, User, Globe, PenTool, Slack, Github, Dribbble } from 'lucide-react';
import Button from './ui/Button';
import { FaqItem, PricingTier } from '../types';

// --- Testimonials Section ---

const testimonialsData = [
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

// Converted to percentage positions for smooth scattering animation
const backgroundTestimonialsData = [
    { name: "Tom H.", handle: "@tom_h", role: "Dev", quote: "Simple and clean.", icon: Twitter, color: "text-sky-500", top: "10%", left: "5%" },
    { name: "Lisa K.", handle: "@lisa_ux", role: "Designer", quote: "Love the UI.", icon: Instagram, color: "text-pink-500", top: "15%", left: "85%" },
    { name: "Raj P.", handle: "@raj_pm", role: "PM", quote: "Great insights.", icon: Linkedin, color: "text-blue-700", top: "75%", left: "5%" },
    { name: "Anna S.", handle: "@anna_art", role: "Creator", quote: "My followers love it.", icon: Globe, color: "text-gray-600", top: "80%", left: "80%" },
    { name: "Mike R.", handle: "@mike_r", role: "Manager", quote: "Effective.", icon: MessageCircle, color: "text-green-500", top: "40%", left: "2%" },
    { name: "Joana", handle: "@jo_tweets", role: "Writer", quote: "No more debates.", icon: Twitter, color: "text-sky-500", top: "60%", left: "92%" },

    // Expanded data
    { name: "Sam D.", handle: "@sam_dev", role: "Engineer", quote: "Fastest way to decide.", icon: Github, color: "text-gray-800", top: "15%", left: "20%" },
    { name: "Kate M.", handle: "@kate_mkt", role: "Marketer", quote: "A/B testing made easy.", icon: Slack, color: "text-purple-500", top: "85%", left: "70%" },
    { name: "Leo F.", handle: "@leo_f", role: "Artist", quote: "Beautiful interface.", icon: Dribbble, color: "text-pink-600", top: "45%", left: "95%" },
    { name: "Nina W.", handle: "@nina_w", role: "Student", quote: "So helpful.", icon: Instagram, color: "text-pink-500", top: "5%", left: "60%" },
    { name: "Chris B.", handle: "@chris_b", role: "Founder", quote: "Essential tool.", icon: Twitter, color: "text-sky-500", top: "90%", left: "30%" },
    { name: "Alex G.", handle: "@alex_g", role: "User", quote: "Highly recommend.", icon: Globe, color: "text-blue-600", top: "55%", left: "10%" },

    // Filling the bottom empty space
    { name: "Morgan L.", handle: "@morgan_l", role: "Director", quote: "Saves hours.", icon: Linkedin, color: "text-blue-700", top: "88%", left: "45%" },
    { name: "Casey R.", handle: "@casey_r", role: "Freelancer", quote: "Clients love it.", icon: MessageCircle, color: "text-green-500", top: "70%", left: "75%" },
    { name: "Jamie T.", handle: "@jamie_t", role: "Prod", quote: "Quick validation.", icon: Slack, color: "text-purple-500", top: "92%", left: "15%" },
    { name: "Riley K.", handle: "@riley_k", role: "UX", quote: "Clear data.", icon: Dribbble, color: "text-pink-600", top: "85%", left: "90%" },
    { name: "Jordan P.", handle: "@jordan_p", role: "Teacher", quote: "Engaging.", icon: Twitter, color: "text-sky-500", top: "65%", left: "18%" },
    { name: "Taylor S.", handle: "@taylor_s", role: "Blogger", quote: "Fun to use.", icon: Instagram, color: "text-pink-500", top: "72%", left: "60%" },
    { name: "Quinn A.", handle: "@quinn_a", role: "Musician", quote: "Fan feedback.", icon: Globe, color: "text-gray-600", top: "95%", left: "55%" },
    { name: "Avery M.", handle: "@avery_m", role: "Chef", quote: "Menu planning.", icon: Facebook, color: "text-blue-600", top: "82%", left: "35%" }
];

const BackgroundCard: React.FC<{ data: typeof backgroundTestimonialsData[0], index: number }> = ({ data, index }) => {
    return (
        <motion.div
            className="absolute hidden xl:flex flex-col gap-2 p-4 w-48 bg-white/40 backdrop-blur-[2px] border border-white/60 rounded-xl shadow-sm cursor-default select-none"
            initial={{
                opacity: 0,
                scale: 0.5,
                filter: 'blur(3px) grayscale(100%)',
                zIndex: 0,
                // Start grouped at center
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%'
            }}
            whileInView={{
                opacity: 0.4,
                scale: 0.8,
                // Scatter to actual position
                top: data.top,
                left: data.left,
                x: '-50%', // Keep centered on anchor point
                y: '-50%'
            }}
            viewport={{ once: true, margin: "-100px" }} // Trigger slightly inside
            transition={{
                duration: 1.2,
                delay: index * 0.05, // Stagger effect
                type: "spring",
                stiffness: 50,
                damping: 20
            }}
            whileHover={{
                opacity: 1,
                scale: 1.1,
                filter: 'blur(0px) grayscale(0%)',
                zIndex: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderColor: 'rgba(229, 231, 235, 1)',
                transition: { duration: 0.2, delay: 0 }
            }}
        >
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.handle}`} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-gray-700 truncate">{data.name}</span>
                </div>
                <data.icon size={10} className={`ml-auto shrink-0 ${data.color}`} />
            </div>
            <p className="text-[10px] text-gray-500 leading-tight truncate">"{data.quote}"</p>
        </motion.div>
    )
}

const PopCard: React.FC<{ data: typeof testimonialsData[number], index: number }> = ({ data, index }) => {
    const controls = useAnimation();

    useEffect(() => {
        // Random "pop" effect at irregular intervals
        const randomDelay = Math.random() * 5000 + 2000; // 2-7 seconds
        const interval = setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance to pop per interval
                controls.start({
                    scale: [1, 1.03, 1],
                    boxShadow: [
                        "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    ],
                    transition: { duration: 0.4 }
                });
            }
        }, randomDelay);

        return () => clearInterval(interval);
    }, [controls]);

    // Random slight rotation for "scattered" look
    const rotation = index % 2 === 0 ? 1 : -1;

    // Width classes based on size prop
    const widthClass = data.size === 'lg' ? 'md:w-[400px]' : data.size === 'md' ? 'md:w-[350px]' : 'md:w-[300px]';
    // Vertical offset for "masonry" feel
    const offsetClass = index % 3 === 0 ? 'mt-0' : index % 3 === 1 ? 'md:mt-12' : 'md:mt-24';

    return (
        <motion.div
            animate={controls}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
            whileHover={{ y: -5, rotate: 0, scale: 1.02, zIndex: 10, transition: { duration: 0.2 } }}
            className={`
                ${widthClass} ${offsetClass} w-full
                bg-white p-6 rounded-2xl border border-gray-100 shadow-sm
                flex flex-col gap-4 relative group transform transition-all z-10
            `}
            style={{ rotate: `${rotation}deg` }}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.handle}`}
                            alt={data.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 text-sm leading-tight">{data.name}</h4>
                        <span className="text-xs text-gray-400">{data.role}</span>
                    </div>
                </div>
                <div className={`p-1.5 rounded-full bg-gray-50 ${data.color}`}>
                    <data.icon size={14} />
                </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed font-sans">
                "{data.quote}"
            </p>

            <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                <span>{data.handle}</span>
            </div>
        </motion.div>
    );
};

const Testimonials: React.FC = () => (
    <section className="pt-32 pb-12 bg-brand-50 overflow-hidden relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-16 relative z-20"
            >
                <span className="text-gray-900 font-semibold tracking-wider uppercase text-xs border-b border-gray-200 pb-1">Social Proof</span>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-900 mt-6 max-w-2xl mx-auto leading-tight">
                    Trusted by people who hate <span className="italic text-gray-400">overthinking.</span>
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative h-[600px] overflow-hidden"
            >
                {/* Background Layer - Unfocused Cards - Scatter Animation */}
                <div className="absolute inset-0 pointer-events-none md:pointer-events-auto">
                    {backgroundTestimonialsData.map((data, i) => (
                        <BackgroundCard key={i} data={data} index={i} />
                    ))}
                </div>

                {/* Foreground Layer - Focused Cards */}
                <div className="flex flex-wrap justify-center gap-6 items-start relative z-10">
                    {testimonialsData.map((t, i) => (
                        <PopCard key={i} data={t} index={i} />
                    ))}
                </div>

                {/* Progressive Fade at Bottom - Hints at more content */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-50 via-brand-50/80 to-transparent pointer-events-none z-20" />
            </motion.div>
        </div>
    </section>
);

// --- Pricing Section ---

const Pricing: React.FC = () => {
    const plans: PricingTier[] = [
        {
            name: "Free",
            price: "$0",
            description: "For individuals & hobbyists.",
            features: ["Unlimited public polls", "1000 votes per poll", "Standard analytics", "Ad-supported", "Community support"],
            cta: "Start for Free"
        },
        {
            name: "Pro",
            price: "$9",
            description: "For creators & power users.",
            features: ["Private (link-only) polls", "Unlimited votes", "Deep demographics", "Export CSV data", "No ads", "Priority support"],
            cta: "Go Pro",
            popular: true
        }
    ];

    return (
        <section id="pricing" className="py-32 bg-white text-gray-900 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-3xl -z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm text-xs font-medium text-gray-500 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-900"></span>
                        PRICING
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-900 tracking-tight">
                        Fair & Simple <span className="italic text-gray-400">Pricing</span>
                    </h2>
                    <p className="text-gray-500 mt-6 text-lg font-light max-w-xl mx-auto">
                        Start for free. Upgrade when you need the power.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            className={`
                                relative p-10 rounded-[40px] flex flex-col overflow-hidden group transition-all duration-500 min-h-[600px]
                                ${plan.popular
                                    ? 'bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.05),0_20px_40px_-10px_rgba(0,0,0,0.1)]'
                                    : 'bg-white border border-gray-100 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02),0_10px_30px_-10px_rgba(0,0,0,0.05)]'}
                            `}
                        >
                            {/* Top Highlight for 3D effect */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                            <div className="mb-12 relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-serif font-medium text-brand-900">{plan.name}</h3>
                                    {plan.popular && <span className="px-3 py-1 bg-brand-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-brand-900/20">Popular</span>}
                                </div>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-6xl font-serif text-brand-900 tracking-tight">{plan.price}</span>
                                    <span className="text-gray-400 text-base font-medium">/mo</span>
                                </div>
                                <p className="text-base text-gray-500 font-light leading-relaxed">{plan.description}</p>
                            </div>

                            {/* Subtle Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />

                            <ul className="space-y-6 mb-12 flex-1 relative z-10">
                                {plan.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-4 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                        <div className={`p-1 rounded-full ${plan.popular ? 'bg-brand-900/5 text-brand-900' : 'bg-gray-100 text-gray-400'} shrink-0`}>
                                            <Check size={12} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-medium">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'secondary'}
                                className={`w-full justify-center py-4 text-sm rounded-2xl ${plan.popular ? 'shadow-xl shadow-brand-900/10 hover:shadow-brand-900/20' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// --- Reach Out Section (Replaces FAQ) ---

const ReachOut: React.FC = () => {
    return (
        <section id="contact" className="py-24 bg-brand-50 border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px bg-gray-200 w-12"></div>
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Reach out anytime</span>
                    <div className="h-px bg-gray-200 w-12"></div>
                </div>

                <h2 className="text-5xl md:text-6xl font-serif font-medium text-brand-900 mb-6 tracking-tight">
                    Stuck? Ping us..
                </h2>

                <p className="text-xl text-gray-500 font-light mb-10">
                    We'll help you poll your first vote fast.
                </p>

                <div className="flex flex-col items-center justify-center gap-8">
                    <a href="#" className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-brand-900 hover:scale-110 hover:shadow-md transition-all duration-300 group">
                        {/* X Logo SVG */}
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current group-hover:text-black" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                    </a>

                    <a href="mailto:support@pollpath.com" className="text-lg font-medium text-brand-900 hover:text-gray-600 transition-colors border-b border-brand-900/10 hover:border-brand-900 pb-0.5">
                        support@pollpath.com
                    </a>
                </div>
            </div>
        </section>
    )
}

// --- Main Footer ---

export const FooterMain: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center text-white font-bold font-serif text-lg">P</div>
                            <span className="font-serif font-bold text-xl text-brand-900">PollPath</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            The decision engine for indecisive humans. Built for community clarity.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-900 hover:text-white transition-colors">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-900">Features</a></li>
                            <li><a href="#" className="hover:text-brand-900">Integrations</a></li>
                            <li><a href="#" className="hover:text-brand-900">Pricing</a></li>
                            <li><a href="#" className="hover:text-brand-900">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-900">About</a></li>
                            <li><a href="#" className="hover:text-brand-900">Careers</a></li>
                            <li><a href="#" className="hover:text-brand-900">Blog</a></li>
                            <li><a href="#" className="hover:text-brand-900">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-brand-900">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-900">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-brand-900">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} PollPath Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Made with 🖤 by Soham</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export const FooterSection = () => (
    <>
        <Testimonials />
        <Pricing />
        <ReachOut />
        <FooterMain />
    </>
);
