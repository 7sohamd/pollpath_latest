import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

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
                <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />

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

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.span className="text-2xl font-bold text-brand-900">
                    {rounded}
                </motion.span>
                <span className="text-2xl font-bold text-brand-900">%</span>
            </div>
        </div>
    );
};

export default InsightsGraphic;
