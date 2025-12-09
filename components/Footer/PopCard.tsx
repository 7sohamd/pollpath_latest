import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Testimonial } from '../../constants/testimonialData';

interface PopCardProps {
    data: Testimonial;
    index: number;
}

const PopCard: React.FC<PopCardProps> = ({ data, index }) => {
    const controls = useAnimation();

    useEffect(() => {
        const randomDelay = Math.random() * 5000 + 2000;
        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
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

    const rotation = index % 2 === 0 ? 1 : -1;
    const widthClass = data.size === 'lg' ? 'md:w-[400px]' : data.size === 'md' ? 'md:w-[350px]' : 'md:w-[300px]';
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

export default PopCard;
