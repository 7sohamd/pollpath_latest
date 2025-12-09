import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
            <div className="absolute left-10 top-10 bottom-10 w-px bg-gray-200" />

            {bars.map((width, i) => (
                <div key={i} className="flex items-center gap-3 w-full relative z-10">
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

                    <motion.span className="text-[10px] text-gray-400 font-mono w-6 text-right tabular-nums">
                        {Math.round(width)}%
                    </motion.span>
                </div>
            ))}
        </div>
    );
};

export default StatsGraphic;
