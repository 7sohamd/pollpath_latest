import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            {/* Creator Info Skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1.5 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
            </div>

            {/* Question Skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-4/5 animate-pulse" />
            </div>

            {/* Vote Bars Skeleton */}
            <div className="space-y-3 mb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Tags Skeleton */}
            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-lg w-16 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-lg w-20 animate-pulse" />
            </div>

            {/* Spacer */}
            <div className="flex-1 min-h-[20px]" />

            {/* Footer Skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

interface SkeletonFeedProps {
    count?: number;
}

const SkeletonFeed: React.FC<SkeletonFeedProps> = ({ count = 9 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 auto-rows-auto"
        >
            {Array.from({ length: count }).map((_, index) => {
                // Match the bento grid pattern
                const getColSpan = () => {
                    const position = index % 9;
                    if (position === 0) return 'lg:col-span-4';
                    if (position === 1 || position === 2) return 'lg:col-span-2';
                    if (position === 3 || position === 4) return 'lg:col-span-3';
                    if (position === 5) return 'lg:col-span-2';
                    if (position === 6) return 'lg:col-span-4';
                    if (position === 7 || position === 8) return 'lg:col-span-3';
                    return 'lg:col-span-2';
                };

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`md:col-span-1 ${getColSpan()}`}
                    >
                        <SkeletonCard />
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default SkeletonFeed;
