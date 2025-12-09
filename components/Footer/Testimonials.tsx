import React from 'react';
import { motion } from 'framer-motion';
import { testimonialsData, backgroundTestimonialsData } from '../../constants/testimonialData';
import TestimonialCard from './TestimonialCard';
import PopCard from './PopCard';

const Testimonials: React.FC = () => (
    <section className="pt-32 pb-12 bg-brand-50 overflow-hidden relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

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
                        <TestimonialCard key={i} data={data} index={i} />
                    ))}
                </div>

                {/* Foreground Layer - Focused Cards */}
                <div className="flex flex-wrap justify-center gap-6 items-start relative z-10">
                    {testimonialsData.map((t, i) => (
                        <PopCard key={i} data={t} index={i} />
                    ))}
                </div>

                {/* Progressive Fade at Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-50 via-brand-50/80 to-transparent pointer-events-none z-20" />
            </motion.div>
        </div>
    </section>
);

export default Testimonials;
