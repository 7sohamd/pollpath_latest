import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import RollingQuestion from './RollingQuestion';

const UseCases: React.FC = () => {
    const cases = [
        "Which city should I move to?",
        "Which thumbnail gets more clicks?",
        "College fest theme?",
        "Meetup timing?",
        "Product name ideas",
        "Logo preference A/B"
    ];

    return (
        <section id="use-cases" className="py-24 bg-brand-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent opacity-60 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-gray-900 font-semibold tracking-wider uppercase text-xs border-b border-gray-200 pb-1 mb-6 inline-block">Use Cases</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-900 mb-6 leading-tight">
                            For creators, students, <span className="italic text-gray-400">travelers</span>, and overthinkers.
                        </h2>
                        <p className="text-gray-500 text-lg mb-8 max-w-md font-light leading-relaxed">
                            Whether you are optimizing a product launch or just trying to decide where to eat dinner, PollPath brings clarity to the chaos.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-brand-900 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-gray-900/10 hover:shadow-xl transition-all flex items-center gap-2 group"
                        >
                            Start Exploring <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>

                    <div className="flex flex-col gap-4 relative">
                        {cases.map((text, i) => (
                            <RollingQuestion
                                key={i}
                                text={text}
                                index={i}
                                className={`self-start lg:self-auto cursor-default ${i % 2 === 0 ? 'lg:ml-12' : ''}`}
                                cardClassName="bg-white/60 backdrop-blur-md border border-gray-200/60 px-8 py-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UseCases;
