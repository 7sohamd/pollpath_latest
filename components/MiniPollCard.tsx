import React from 'react';
import { motion } from 'framer-motion';
import { MiniPollData } from '../types';

interface MiniPollCardProps {
    poll: MiniPollData;
    onViewPoll: (pollId: string) => void;
}

const MiniPollCard: React.FC<MiniPollCardProps> = ({ poll, onViewPoll }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden my-2"
        >
            <div className="p-4">
                {/* Question */}
                <h4 className="text-sm font-semibold text-brand-900 mb-3 line-clamp-2">
                    {poll.question}
                </h4>

                {/* Options (top 3) */}
                <div className="space-y-2 mb-3">
                    {poll.options.slice(0, 3).map((option, idx) => (
                        <div key={idx} className="relative">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-700 font-medium truncate pr-2">
                                    {option.label}
                                </span>
                                <span className="text-brand-900 font-bold shrink-0">
                                    {option.percentage}%
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${option.percentage}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-brand-900/80 rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                        {poll.totalVotes.toLocaleString()} votes
                    </span>
                    <button
                        onClick={() => onViewPoll(poll.id)}
                        className="text-xs font-medium text-brand-900 hover:text-black transition-colors"
                    >
                        View poll →
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MiniPollCard;
