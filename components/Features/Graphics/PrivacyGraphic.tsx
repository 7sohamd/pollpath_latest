import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye } from 'lucide-react';

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
    );
};

export default PrivacyGraphic;
