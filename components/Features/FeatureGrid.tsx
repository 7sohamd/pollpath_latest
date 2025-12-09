import React from 'react';
import { motion } from 'framer-motion';
import PlatformGraphic from './Graphics/PlatformGraphic';
import TemplatesGraphic from './Graphics/TemplatesGraphic';
import LiveLogsGraphic from './Graphics/LiveLogsGraphic';
import PrivacyGraphic from './Graphics/PrivacyGraphic';
import InsightsGraphic from './Graphics/InsightsGraphic';

const FeatureGrid: React.FC = () => {
    const cardClass = "group rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-sm flex flex-col overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 relative";
    const graphicContainerClass = "flex-1 relative overflow-hidden flex items-center justify-center";
    const contentClass = "p-6 relative z-10";

    return (
        <section id="features" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <span className="text-gray-900 font-semibold tracking-wider uppercase text-xs border-b border-gray-200 pb-1">Features</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-text-main mt-6">
                        Everything you need to <br /> <span className="italic text-gray-400">resolve the debate.</span>
                    </h2>
                    <p className="mt-6 text-text-muted text-lg font-light">
                        Powerful tools wrapped in a minimal interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
                    <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                        <div className={graphicContainerClass}>
                            <PlatformGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Viral Distribution</h3>
                            <p className="text-sm text-gray-500">One link, everywhere. Optimized for social sharing. <span className="text-xs text-brand-500 opacity-60">(Try clicking the icon!)</span></p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-2`}>
                        <div className={graphicContainerClass}>
                            <TemplatesGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Templates</h3>
                            <p className="text-sm text-gray-500">Ready-to-use flows for any question. From binary votes to ranked choice.</p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                        <div className={graphicContainerClass}>
                            <LiveLogsGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Live Pulse</h3>
                            <p className="text-sm text-gray-500">Watch votes and comments roll in real-time.</p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                        <div className={graphicContainerClass}>
                            <PrivacyGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Total Control</h3>
                            <p className="text-sm text-gray-500">Switch between public buzz and private feedback.</p>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -2 }} className={`${cardClass} md:col-span-1`}>
                        <div className={graphicContainerClass}>
                            <InsightsGraphic />
                        </div>
                        <div className={contentClass}>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Deep Insights</h3>
                            <p className="text-sm text-gray-500">Export data. Understand the 'Why' behind the vote.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
