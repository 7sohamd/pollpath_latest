import React from 'react';
import { motion } from 'framer-motion';
import { testimonialsData, backgroundTestimonialsData } from '../../constants/testimonialData';
import TestimonialCard from './TestimonialCard';
import PopCard from './PopCard';

const Testimonials: React.FC = () => (
    <section className="pt-16 pb-12 bg-brand-50 overflow-hidden relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative h-[800px] overflow-hidden"
            >
                {/* Background Layer - Unfocused Cards - Scatter Animation */}
                <div className="absolute inset-0 pointer-events-none md:pointer-events-auto">
                    {backgroundTestimonialsData.map((data, i) => (
                        <TestimonialCard key={i} data={data} index={i} />
                    ))}
                </div>

                {/* Foreground Layer - Focused Cards - Positioned at Edges */}
                <div className="absolute inset-0 pointer-events-auto">
                    {/* Top-left area */}
                    <div className="absolute top-0 left-0 w-[350px] flex flex-col gap-6">
                        <PopCard data={testimonialsData[0]} index={0} />
                        <PopCard data={testimonialsData[1]} index={1} />
                    </div>

                    {/* Top-center area - Above the text */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] flex flex-col gap-6">
                        <PopCard data={testimonialsData[2]} index={2} />
                    </div>

                    {/* Top-right area */}
                    <div className="absolute top-0 right-0 w-[320px] flex flex-col gap-6">
                        <PopCard data={testimonialsData[4]} index={4} />
                    </div>

                    {/* Bottom-left area */}
                    <div className="absolute bottom-20 left-0 w-[350px] flex flex-col gap-6">
                        <PopCard data={testimonialsData[3]} index={3} />
                    </div>

                    {/* Bottom-right area */}
                    <div className="absolute bottom-20 right-0 w-[380px] flex flex-col gap-6">
                        <PopCard data={testimonialsData[5]} index={5} />
                    </div>
                </div>

                {/* Centered Text with Blur-In Animation - Surrounded by Testimonials */}
                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none px-4"
                >
                    <span className="text-gray-900 font-semibold tracking-wider uppercase text-xs border-b border-gray-200 pb-1 bg-brand-50/80 backdrop-blur-sm px-4">Social Proof</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-900 mt-6 max-w-2xl mx-auto leading-tight text-center bg-brand-50/80 backdrop-blur-sm px-6 py-4 rounded-2xl">
                        Trusted by people who hate <span className="italic text-gray-400">overthinking.</span>
                    </h2>
                </motion.div>

                {/* Progressive Fade at Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-50 via-brand-50/80 to-transparent pointer-events-none z-20" />
            </motion.div>
        </div>
    </section>
);

export default Testimonials;
