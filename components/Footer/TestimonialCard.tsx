import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundTestimonial } from '../../constants/testimonialData';

interface TestimonialCardProps {
    data: BackgroundTestimonial;
    index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ data, index }) => {
    return (
        <motion.div
            className="absolute hidden xl:flex flex-col gap-2 p-4 w-48 bg-white/40 backdrop-blur-[2px] border border-white/60 rounded-xl shadow-sm cursor-default select-none"
            initial={{
                opacity: 0,
                scale: 0.5,
                filter: 'blur(3px) grayscale(100%)',
                zIndex: 0,
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%'
            }}
            whileInView={{
                opacity: 0.4,
                scale: 0.8,
                top: data.top,
                left: data.left,
                x: '-50%',
                y: '-50%'
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 1.2,
                delay: index * 0.05,
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
    );
};

export default TestimonialCard;
