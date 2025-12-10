import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PollTemplate } from '../../types';
import PollTemplateCard from './PollTemplateCard';

interface TemplateCarouselProps {
    templates: PollTemplate[];
    onSelect: (template: PollTemplate) => void;
}

const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ templates, onSelect }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotation (always enabled)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % templates.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(interval);
    }, [templates.length]);

    const goToNext = () => {
        setActiveIndex((prev) => (prev + 1) % templates.length);
    };

    const goToPrevious = () => {
        setActiveIndex((prev) => (prev - 1 + templates.length) % templates.length);
    };

    const getCardPosition = (index: number) => {
        const diff = index - activeIndex;
        if (diff === 0) return 'center';
        if (diff === 1 || diff === -(templates.length - 1)) return 'right';
        if (diff === -1 || diff === templates.length - 1) return 'left';
        return 'hidden';
    };

    return (
        <div className="relative w-full pt-0 pb-4">
            {/* Carousel Container */}
            <div className="relative h-[500px] flex items-center justify-center">
                {templates.map((template, index) => {
                    const position = getCardPosition(index);

                    return (
                        <motion.div
                            key={index}
                            className="absolute"
                            initial={false}
                            animate={{
                                x: position === 'center' ? 0 : position === 'left' ? '-55%' : position === 'right' ? '55%' : 0,
                                scale: position === 'center' ? 1 : 0.75,
                                opacity: position === 'center' ? 1 : position === 'hidden' ? 0 : 0.4,
                                filter: position === 'center' ? 'blur(0px)' : 'blur(4px)',
                                zIndex: position === 'center' ? 30 : position === 'hidden' ? 0 : 10,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.32, 0.72, 0, 1],
                            }}
                            style={{
                                width: '380px',
                                maxWidth: '90vw',
                                pointerEvents: position === 'center' ? 'auto' : 'none',
                            }}
                        >
                            <PollTemplateCard
                                template={template}
                                onSelect={onSelect}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                aria-label="Previous template"
            >
                <ChevronLeft size={24} className="text-gray-700 group-hover:text-brand-900 transition-colors" strokeWidth={2.5} />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                aria-label="Next template"
            >
                <ChevronRight size={24} className="text-gray-700 group-hover:text-brand-900 transition-colors" strokeWidth={2.5} />
            </button>

            {/* Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
                {templates.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === activeIndex
                            ? 'w-8 bg-brand-900'
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to template ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TemplateCarousel;
