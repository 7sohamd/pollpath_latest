import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ROLLING_CANDIDATES } from '../../constants/featureGraphicsData';

interface RollingQuestionProps {
    text: string;
    index: number;
    className: string;
    cardClassName: string;
}

const RollingQuestion: React.FC<RollingQuestionProps> = ({ text, index, className, cardClassName }) => {
    const sequence = useMemo(() => {
        const shuffled = [...ROLLING_CANDIDATES].sort(() => 0.5 - Math.random());
        const count = 5 + (index % 4);
        return [...shuffled.slice(0, count), text];
    }, [text, index]);

    const cardHeight = 84;
    const gap = 16;
    const stride = cardHeight + gap;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`h-[84px] overflow-hidden relative ${className}`}
        >
            <motion.div
                initial={{ y: 0 }}
                whileInView={{ y: -((sequence.length - 1) * stride) }}
                viewport={{ once: true }}
                transition={{
                    delay: 0.1 * index,
                    duration: 1.5 + (index * 0.2),
                    ease: [0.2, 1, 0.4, 1]
                }}
                className="flex flex-col gap-4"
            >
                {sequence.map((t, i) => (
                    <div key={i} className={`${cardClassName} h-[84px] w-full flex items-center whitespace-nowrap`}>
                        <span className="text-lg text-gray-700 font-medium tracking-tight">"{t}"</span>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default RollingQuestion;
