import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';

const PlatformGraphic = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText("https://pollpath.com/poll/demo-link-123");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
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
    );
};

export default PlatformGraphic;
