import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Share2, Bookmark, TrendingUp, Check } from 'lucide-react';
import { Poll } from '../../types';
import toast from 'react-hot-toast';

interface FeedCardProps {
    poll: Poll;
    onClick: () => void;
    onSave: (pollId: string) => void;
    isSaved: boolean;
    index: number;
    featured?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({ poll, onClick, onSave, isSaved, index, featured = false }) => {
    const [isCopied, setIsCopied] = useState(false);
    const totalVotes = poll.totalVotes || 0;
    const timeRemaining = poll.closesAt ? new Date(poll.closesAt).getTime() - Date.now() : null;
    const daysLeft = timeRemaining ? Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)) : null;

    // For horizontal bento, wide cards get more content
    const position = index % 9;
    const isWide = position === 0 || position === 6;

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}?poll=${poll.id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            toast.success('Link copied to clipboard!');

            // Reset after 2 seconds
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSave(poll.id!);
        toast.success(isSaved ? 'Removed from saved' : 'Saved to collection!');
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={onClick}
            className="
        w-full bg-white rounded-2xl p-6 cursor-pointer
        border border-gray-100 shadow-sm hover:shadow-lg
        transition-all duration-300 flex flex-col
        group relative overflow-hidden h-full
      "
        >
            {/* Trending Badge */}
            {featured && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Trending</span>
                    </div>
                </div>
            )}

            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-900 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                        {poll.identity === 'anonymous' ? 'A' : (poll.creatorName ? poll.creatorName[0].toUpperCase() : '?')}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {poll.identity === 'anonymous' ? 'Anonymous' : (poll.creatorName || 'Poll Creator')}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(poll.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Question */}
            <h3 className={`font-serif text-gray-900 mb-4 leading-snug ${isWide ? 'line-clamp-3 text-xl' : 'line-clamp-2 text-lg'}`}>
                {poll.question}
            </h3>

            {/* Vote Preview Bars - Always vertical, bars stretch wider in wide cards */}
            <div className="space-y-2 mb-4">
                {poll.options.slice(0, isWide ? 4 : 3).map((option, idx) => {
                    const percentage = totalVotes > 0 ? (option.votesCount / totalVotes) * 100 : 0;
                    return (
                        <div key={idx}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700 truncate">{option.label}</span>
                                <span className="text-xs text-gray-500 ml-2">{Math.round(percentage)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-brand-900 to-purple-600 rounded-full"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tags */}
            {poll.tags && poll.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {poll.tags.slice(0, 3).map((tag, idx) => (
                        <motion.span
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-brand-900 hover:text-white transition-colors duration-200"
                        >
                            #{tag}
                        </motion.span>
                    ))}
                </div>
            )}

            {/* Spacer to push footer to bottom */}
            <div className="flex-1 min-h-[20px]" />

            {/* Footer Metadata - Always visible */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{totalVotes}</span>
                    </div>
                    {daysLeft !== null && daysLeft > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{daysLeft}d left</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className={`p-2 rounded-lg transition-colors ${isCopied
                            ? 'bg-green-100 text-green-600'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-brand-900'
                            }`}
                        title={isCopied ? 'Link copied!' : 'Share poll'}
                    >
                        {isCopied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Share2 className="w-4 h-4" />
                        )}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isSaved ? 'text-amber-600' : 'text-gray-400 hover:text-brand-900'
                            }`}
                        title={isSaved ? 'Remove from saved' : 'Save poll'}
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
                    </motion.button>
                </div>
            </div>
        </motion.article>
    );
};

export default FeedCard;
