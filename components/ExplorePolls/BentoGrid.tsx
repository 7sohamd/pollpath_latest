import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
    children: ReactNode[];
}

const BentoGrid: React.FC<BentoGridProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 auto-rows-auto"
        >
            {children.map((child, index) => {
                // Horizontal bento grid - some items span multiple columns
                // Pattern creates visual variety: wide cards, regular cards, and small cards
                const getColSpan = () => {
                    const position = index % 9;
                    if (position === 0) return 'lg:col-span-4'; // Wide featured card
                    if (position === 1 || position === 2) return 'lg:col-span-2'; // Two regular cards
                    if (position === 3 || position === 4) return 'lg:col-span-3'; // Two medium cards
                    if (position === 5) return 'lg:col-span-2'; // Regular card
                    if (position === 6) return 'lg:col-span-4'; // Wide card
                    if (position === 7 || position === 8) return 'lg:col-span-3'; // Two medium cards
                    return 'lg:col-span-2'; // Default
                };

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className={`
              md:col-span-1
              ${getColSpan()}
            `}
                    >
                        {child}
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default BentoGrid;
