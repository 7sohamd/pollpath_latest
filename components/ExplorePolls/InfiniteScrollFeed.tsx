import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollFeedProps {
    children: ReactNode;
    hasMore: boolean;
    onLoadMore: () => void;
    loading: boolean;
}

const InfiniteScrollFeed: React.FC<InfiniteScrollFeedProps> = ({
    children,
    hasMore,
    onLoadMore,
    loading,
}) => {
    const observerTarget = useRef<HTMLDivElement>(null);
    const [hasObserved, setHasObserved] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !hasObserved) {
                    setHasObserved(true);
                    onLoadMore();
                    // Reset after a delay to allow next load
                    setTimeout(() => setHasObserved(false), 1000);
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, onLoadMore, hasObserved]);

    return (
        <div className="space-y-6">
            {children}

            {/* Loading Indicator */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center py-12"
                >
                    <Loader2 className="w-8 h-8 text-brand-900 animate-spin" />
                </motion.div>
            )}

            {/* Intersection Observer Target */}
            {hasMore && !loading && (
                <div ref={observerTarget} className="h-20" />
            )}

            {/* End of Feed Message */}
            {!hasMore && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <p className="text-gray-400 text-sm font-medium">
                        You've reached the end of the feed
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default InfiniteScrollFeed;
