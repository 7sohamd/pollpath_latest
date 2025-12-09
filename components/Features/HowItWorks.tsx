import React from 'react';
import { motion } from 'framer-motion';
import CreateGraphic from './Graphics/CreateGraphic';
import ShareGraphic from './Graphics/ShareGraphic';
import StatsGraphic from './Graphics/StatsGraphic';

const HowItWorks: React.FC = () => {
    const cardClass = "group relative overflow-hidden rounded-[32px] border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 h-[400px] flex flex-col";
    const graphicContainerClass = "flex-1 relative overflow-hidden flex items-center justify-center";
    const contentClass = "p-8 relative z-10";

    return (
        <section id="how-it-works" className="py-24 bg-brand-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-gray-200">
                        Benefits
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-text-main mt-6 mb-2">
                        Why Choose <span className="italic text-gray-500">PollPath?</span>
                    </h2>
                    <p className="text-text-muted">Design, test, and publish polls — fast.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div whileHover={{ y: -5 }} className={cardClass}>
                        <div className={graphicContainerClass}>
                            <CreateGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Ask Anything</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Create a poll in seconds. Add text, images, or links with our intuitive builder.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={cardClass}>
                        <div className={graphicContainerClass}>
                            <ShareGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Share Everywhere</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Seamless integration. Get a unique link or let the community discover it instantly.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={cardClass}>
                        <div className={graphicContainerClass}>
                            <StatsGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Measurable Impact</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Track success in real-time. Uncover insights and achieve data-backed clarity.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
