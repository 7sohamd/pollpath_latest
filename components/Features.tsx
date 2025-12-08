import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Zap, Globe, MessageCircle, BarChart3, Shield, Layers, Plus, Send, CheckCircle2, User, FileCode, Workflow, Share2, Lock, Eye, Twitter, Linkedin, Facebook, Download, Copy, PieChart, Check, ArrowRight } from 'lucide-react';
import { Feature } from '../types';

// --- Micro-Interaction Graphics ---

const CreateGraphic = () => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setStatus('sending');
        
        // Simulate network delay
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setInputValue("");
            }, 2500);
        }, 800);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-[240px] bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 space-y-4">
                {/* Header Dots */}
                <div className="flex gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                </div>
                
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="h-24 flex flex-col items-center justify-center gap-3"
                        >
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <Check size={24} />
                            </div>
                            <span className="text-sm font-semibold text-emerald-700">Poll Created!</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Question</label>
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your question..."
                                    disabled={status === 'sending'}
                                    className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 transition-all placeholder:text-gray-400 text-gray-800"
                                />
                            </div>
                            
                            <div className="flex justify-end pt-2">
                                <button 
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || status === 'sending'}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all
                                        ${inputValue.trim() && status !== 'sending'
                                            ? 'bg-brand-900 text-white shadow-md hover:shadow-lg active:scale-95' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                    `}
                                >
                                    {status === 'sending' ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Post Poll <Send size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Tooltip hint if empty */}
            {status === 'idle' && !inputValue && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-20 -right-2 bg-brand-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl pointer-events-none"
                >
                    Try typing something!
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-900" />
                </motion.div>
            )}
        </div>
    );
}

const ShareGraphic = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
             {/* Background Rings - Expanding Effect */}
             {[1, 2, 3].map((i) => (
                 <motion.div
                    key={i}
                    className="absolute rounded-full border border-brand-900/5"
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: 320, height: 320, opacity: 0 }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 1,
                        ease: "easeOut" 
                    }}
                 />
             ))}

            {/* Central Node */}
            <div className="relative z-20 w-16 h-16 bg-white rounded-full shadow-xl shadow-gray-200 border border-gray-100 flex items-center justify-center">
                 <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center">
                     <Globe className="w-6 h-6 text-brand-900" />
                 </div>
            </div>

            {/* Bursting Social Icons */}
            {[
                { icon: Twitter, color: "#0EA5E9", angle: 0, dist: 90 },
                { icon: Facebook, color: "#2563EB", angle: 60, dist: 90 },
                { icon: Linkedin, color: "#0A66C2", angle: 120, dist: 90 },
                { icon: MessageCircle, color: "#10B981", angle: 180, dist: 90 },
                { icon: Copy, color: "#6B7280", angle: 240, dist: 90 },
                { icon: Share2, color: "#8B5CF6", angle: 300, dist: 90 },
            ].map((item, i) => {
                // Calculate position based on angle
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * item.dist;
                const y = Math.sin(rad) * item.dist;
                
                // Random delays for "random order" feel
                // Mixing up the order so they don't burst in a perfect circle
                const delays = [0, 0.4, 0.1, 0.5, 0.2, 0.6]; 
                
                return (
                    <motion.div
                        key={i}
                        className="absolute z-10 w-10 h-10 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-center"
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                        animate={{ 
                            x: [0, x, x, 0],
                            y: [0, y, y, 0],
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1, 1, 0.5]
                        }}
                        transition={{ 
                            duration: 3, 
                            times: [0, 0.15, 0.6, 0.75], // 0-15% expand, 15-60% hold, 60-75% contract, 75-100% wait
                            repeat: Infinity,
                            delay: delays[i],
                            ease: "easeInOut"
                        }}
                    >
                        <item.icon size={18} style={{ color: item.color }} />
                    </motion.div>
                );
            })}
        </div>
    )
}

const StatsGraphic = () => {
    const [bars, setBars] = useState([40, 60, 30, 80]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map(h => Math.max(20, Math.min(100, h + (Math.random() * 40 - 20)))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center gap-4 px-12 py-10 relative">
            {/* Axis Line (Left Vertical) */}
            <div className="absolute left-10 top-10 bottom-10 w-px bg-gray-200" />

            {bars.map((width, i) => (
                <div key={i} className="flex items-center gap-3 w-full relative z-10">
                    {/* Label/Icon Placeholder / Tick */}
                    <div className="w-2 h-px bg-gray-300 shrink-0 absolute left-[-5px]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    
                    <motion.div
                        layout
                        className="h-4 bg-gray-100 rounded-r-full relative group overflow-hidden border border-gray-200/50 shadow-sm"
                        animate={{ width: `${width}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200/60 to-transparent opacity-50" />
                    </motion.div>
                    
                    {/* Value */}
                    <motion.span className="text-[10px] text-gray-400 font-mono w-6 text-right tabular-nums">
                        {Math.round(width)}%
                    </motion.span>
                </div>
            ))}
        </div>
    )
}

// --- Bento Grid Graphics ---

const TemplatesGraphic = () => {
    return (
        <div className="w-full h-full flex items-center justify-center gap-4 relative overflow-hidden px-8">
             {/* Background Subtle Grid - Lighter opacity for gradient blend */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />

             {/* Template Cards */}
             {[
                 { icon: <CheckCircle2 size={18} />, label: "Yes/No", color: "text-emerald-600 bg-emerald-50" },
                 { icon: <BarChart3 size={18} />, label: "Rank", color: "text-blue-600 bg-blue-50" },
                 { icon: <MessageCircle size={18} />, label: "Open", color: "text-purple-600 bg-purple-50" },
             ].map((t, i) => (
                 <motion.div 
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    whileHover={{ y: -8, scale: 1.05, zIndex: 10 }}
                    className="w-32 h-44 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col items-center p-4 gap-3 relative transition-all"
                 >
                     <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center mb-1`}>
                         {t.icon}
                     </div>
                     <div className="w-12 h-2 bg-gray-100 rounded-full" />
                     <div className="w-full space-y-2 mt-2">
                        <div className="w-full h-8 rounded bg-gray-50 border border-gray-100" />
                        <div className="w-full h-8 rounded bg-gray-50 border border-gray-100" />
                     </div>
                 </motion.div>
             ))}
        </div>
    )
}

const PlatformGraphic = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText("https://pollpath.com/poll/demo-link-123");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
             {/* Radiating Rings */}
             {[0, 1, 2].map((i) => (
                 <motion.div
                    key={i}
                    className="absolute rounded-full border border-brand-900/10"
                    initial={{ width: '40px', height: '40px', opacity: 0.8 }}
                    animate={{ width: '250px', height: '250px', opacity: 0 }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 1,
                        ease: "easeOut" 
                    }}
                 />
             ))}

            <div 
                onClick={handleCopy}
                className="relative z-20 w-16 h-16 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-center group cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
                <AnimatePresence mode="wait">
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <Check className="w-6 h-6 text-emerald-500" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="share"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <Share2 className="w-6 h-6 text-brand-900" />
                        </motion.div>
                    )}
                </AnimatePresence>
                {!copied && <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-900 rounded-full border-2 border-white" />}
            </div>
        </div>
    )
}

const LiveLogsGraphic = () => {
    const logs = [
        "Vote from London 🇬🇧", "New comment on #poll-23", "Goal reached: 1000 votes", "Vote from Tokyo 🇯🇵", "Vote from New York 🇺🇸", "Poll shared on Twitter"
    ];
    return (
        <div className="w-full h-full px-6 py-4 overflow-hidden relative flex flex-col justify-center [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee-vertical space-y-3 relative z-10">
                {[...logs, ...logs].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm text-xs text-gray-600 font-medium">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         {log}
                    </div>
                ))}
            </div>
        </div>
    )
}

const PrivacyGraphic = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [interacted, setInteracted] = useState(false);

    useEffect(() => {
        if (interacted) return;
        const interval = setInterval(() => setIsPrivate(prev => !prev), 3000);
        return () => clearInterval(interval);
    }, [interacted]);

    const toggle = () => {
        setInteracted(true);
        setIsPrivate(prev => !prev);
    };

    return (
        <div 
            className="w-full h-full flex flex-col items-center justify-center gap-6 cursor-pointer z-20 relative"
            onClick={toggle}
        >
            <div className="relative w-32 h-16 bg-white rounded-full p-1.5 shadow-inner border border-gray-200/80 transition-colors duration-300">
                <motion.div
                    animate={{ x: isPrivate ? '100%' : '0%' }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-1/2 h-full bg-brand-900 rounded-full shadow-lg flex items-center justify-center"
                >
                   {isPrivate ? <Lock size={16} className="text-white" /> : <Eye size={16} className="text-white" />}
                </motion.div>
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest transition-all">
                {isPrivate ? 'Anonymous' : 'Public'}
            </div>
        </div>
    )
}

const InsightsGraphic = () => {
    const [isHovered, setIsHovered] = useState(false);
    const count = useMotionValue(42);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        const animation = animate(count, isHovered ? 100 : 42, { 
            duration: 1.2, 
            ease: "circOut" 
        });
        return animation.stop;
    }, [isHovered, count]);

    return (
        <div 
            className="w-full h-full flex items-center justify-center relative z-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
             <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                
                {/* Segment 1 */}
                <motion.circle 
                    animate={{ pathLength: isHovered ? 1 : 0.42 }}
                    initial={{ pathLength: 0.42 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    cx="50" cy="50" r="40" 
                    stroke="#111827" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                />
             </svg>
             
             {/* Center Stats */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <motion.span className="text-2xl font-bold text-brand-900">
                     {rounded}
                 </motion.span>
                 <span className="text-2xl font-bold text-brand-900">%</span>
             </div>
        </div>
    )
}

// --- Main Components ---

export const HowItWorks: React.FC = () => {
  // Bezel-less, unified card style
  const cardClass = "group relative overflow-hidden rounded-[32px] border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 h-[400px] flex flex-col";
  const graphicContainerClass = "flex-1 relative overflow-hidden flex items-center justify-center";
  const contentClass = "p-8 relative z-10";

  return (
    <section id="how-it-works" className="py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-gray-200">
             Benefits
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-text-main mt-6 mb-2">
            Why Choose <span className="italic text-gray-500">PollPath?</span>
          </h2>
          <p className="text-text-muted">Design, test, and publish polls — fast.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <motion.div whileHover={{ y: -5 }} className={cardClass}>
                <div className={graphicContainerClass}>
                    <CreateGraphic />
                </div>
                <div className={contentClass}>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Ask Anything</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Create a poll in seconds. Add text, images, or links with our intuitive builder.
                    </p>
                </div>
            </motion.div>

            {/* Card 2 */}
             <motion.div whileHover={{ y: -5 }} className={cardClass}>
                <div className={graphicContainerClass}>
                    <ShareGraphic />
                </div>
                <div className={contentClass}>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Share Everywhere</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Seamless integration. Get a unique link or let the community discover it instantly.
                    </p>
                </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div whileHover={{ y: -5 }} className={cardClass}>
                <div className={graphicContainerClass}>
                    <StatsGraphic />
                </div>
                <div className={contentClass}>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Measurable Impact</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Track success in real-time. Uncover insights and achieve data-backed clarity.
                    </p>
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export const FeatureGrid: React.FC = () => {
  // Bezel-less, unified card style with single gradient
  const cardClass = "group rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-sm flex flex-col overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 relative";
  
  // Unified container for graphic, no separate background
  const graphicContainerClass = "flex-1 relative overflow-hidden flex items-center justify-center";
  
  // Content sits on top of the gradient, no border, no separate background
  const contentClass = "p-6 relative z-10";

  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-2xl mx-auto">
           <span className="text-gray-900 font-semibold tracking-wider uppercase text-xs border-b border-gray-200 pb-1">Features</span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-text-main mt-6">
            Everything you need to <br/> <span className="italic text-gray-400">resolve the debate.</span>
          </h2>
          <p className="mt-6 text-text-muted text-lg font-light">
            Powerful tools wrapped in a minimal interface.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
            
            {/* Item 1: Viral Sharing */}
            <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                <div className={graphicContainerClass}>
                     <PlatformGraphic />
                </div>
                <div className={contentClass}>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Viral Distribution</h3>
                     <p className="text-sm text-gray-500">One link, everywhere. Optimized for social sharing. <span className="text-xs text-brand-500 opacity-60">(Try clicking the icon!)</span></p>
                </div>
            </motion.div>

             {/* Item 2: Smart Templates */}
            <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-2`}>
                <div className={graphicContainerClass}>
                     <TemplatesGraphic />
                </div>
                <div className={contentClass}>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Templates</h3>
                     <p className="text-sm text-gray-500">Ready-to-use flows for any question. From binary votes to ranked choice.</p>
                </div>
            </motion.div>

            {/* Item 3: Live Logs */}
            <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                <div className={graphicContainerClass}>
                    <LiveLogsGraphic />
                </div>
                <div className={contentClass}>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Live Pulse</h3>
                     <p className="text-sm text-gray-500">Watch votes and comments roll in real-time.</p>
                </div>
            </motion.div>

            {/* Item 4: Privacy Toggle */}
            <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                <div className={graphicContainerClass}>
                    <PrivacyGraphic />
                </div>
                <div className={contentClass}>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Total Control</h3>
                     <p className="text-sm text-gray-500">Switch between public buzz and private feedback.</p>
                </div>
            </motion.div>

            {/* Item 5: Insights */}
            <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                <div className={graphicContainerClass}>
                     <InsightsGraphic />
                </div>
                <div className={contentClass}>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">Deep Insights</h3>
                     <p className="text-sm text-gray-500">Export data. Understand the 'Why' behind the vote.</p>
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

// --- Rolling Questions Logic ---
const ROLLING_CANDIDATES = [
    "Should I quit my job?",
    "Pasta or Pizza?",
    "Buy or Rent?",
    "Hire him?",
    "Red or Blue logo?",
    "Friday release?",
    "Go to gym?",
    "Invest in AI?",
    "Start a podcast?",
    "Learn Rust?",
    "Dark mode default?",
    "Netflix or Hulu?",
    "Cat or Dog person?",
    "Remote or Office?",
    "iOS or Android?",
    "Summer or Winter?",
    "Coffee or Tea?"
];

const RollingQuestion = ({ text, index, className, cardClassName }: { text: string, index: number, className: string, cardClassName: string }) => {
    // Generate a sequence that ends with the 'text' prop
    const sequence = useMemo(() => {
         const shuffled = [...ROLLING_CANDIDATES].sort(() => 0.5 - Math.random());
         const count = 5 + (index % 4); // Vary length of scroll slightly
         return [...shuffled.slice(0, count), text];
    }, [text, index]);
    
    // Fixed card height logic
    const cardHeight = 84; // height of one card
    const gap = 16; // gap-4 (1rem = 16px)
    const stride = cardHeight + gap;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`h-[84px] overflow-hidden relative ${className}`} // The Viewport
        >
           {/* The Reel */}
           <motion.div
               initial={{ y: 0 }}
               whileInView={{ y: -((sequence.length - 1) * stride) }}
               viewport={{ once: true }}
               transition={{
                   delay: 0.1 * index, 
                   duration: 1.5 + (index * 0.2), 
                   ease: [0.2, 1, 0.4, 1] // Custom ease out for "slot machine" feel
               }}
               className="flex flex-col gap-4"
           >
               {sequence.map((t, i) => (
                   <div key={i} className={`${cardClassName} h-[84px] w-full flex items-center whitespace-nowrap`}>
                       <span className="text-lg text-gray-700 font-medium tracking-tight">“{t}”</span>
                   </div>
               ))}
           </motion.div>
        </motion.div>
    );
};

export const UseCases: React.FC = () => {
  const cases = [
    "Which city should I move to?",
    "Which thumbnail gets more clicks?",
    "College fest theme?",
    "Meetup timing?",
    "Product name ideas",
    "Logo preference A/B"
  ];

  return (
    <section id="use-cases" className="py-24 bg-brand-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
             <span className="text-gray-900 font-semibold tracking-wider uppercase text-xs border-b border-gray-200 pb-1 mb-6 inline-block">Use Cases</span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-900 mb-6 leading-tight">
              For creators, students, <span className="italic text-gray-400">travelers</span>, and overthinkers.
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md font-light leading-relaxed">
              Whether you are optimizing a product launch or just trying to decide where to eat dinner, PollPath brings clarity to the chaos.
            </p>
            
             <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-brand-900 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-gray-900/10 hover:shadow-xl transition-all flex items-center gap-2 group"
             >
                Start Exploring <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </motion.button>
          </div>

          <div className="flex flex-col gap-4 relative">
             {cases.map((text, i) => (
                <RollingQuestion
                  key={i}
                  text={text}
                  index={i}
                  className={`self-start lg:self-auto cursor-default ${i % 2 === 0 ? 'lg:ml-12' : ''}`}
                  cardClassName="bg-white/60 backdrop-blur-md border border-gray-200/60 px-8 py-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center"
                />
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};