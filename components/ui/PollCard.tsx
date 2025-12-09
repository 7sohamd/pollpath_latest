import React, { useState } from 'react';
import { Clock, User, BarChart2, Check } from 'lucide-react';
import { Poll } from '../../types';
import { motion } from 'framer-motion';

interface PollCardProps {
  poll: Poll;
  onClick?: () => void;
  onVote?: (optionIndex: number) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onClick, onVote }) => {


  // Calculate relative time or closing status mock
  const isClosed = poll.status === 'closed';
  const totalVotes = poll.totalVotes || 0;

  // Mock calculation for bar widths
  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleOptionClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent card click
    // Don't allow voting from card - open modal instead
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
      onClick={onClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Header / Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${poll.type === 'rating' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'
              }`}>
              {poll.type === 'single' ? 'Single Choice' : poll.type === 'multiple' ? 'Multiple Choice' : 'Rating'}
            </span>
            {poll.tags && poll.tags.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {poll.tags[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            <span>{isClosed ? 'Closed' : 'Ends soon'}</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg font-serif font-semibold text-brand-900 mb-4 leading-tight group-hover:text-brand-900 transition-colors line-clamp-2 cursor-pointer">
          {poll.question}
        </h3>

        {/* Options Preview (Top 3) */}
        <div className="space-y-3 mb-6 flex-1">
          {poll.options.slice(0, 3).map((opt, idx) => {
            const percent = getPercentage(opt.votesCount);

            return (
              <div
                key={idx}
                className="relative group/option"
              >
                <div className="flex justify-between text-sm mb-1 text-gray-600 relative z-10">
                  <span className={`truncate pr-2 font-medium `}>
                    {opt.label}
                  </span>
                  <span className="font-medium text-gray-900 shrink-0">{percent}%</span>
                </div>

                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full bg-brand-900/70 group-hover/option:bg-brand-900`}
                  />
                </div>
              </div>
            );
          })}
          {poll.options.length > 3 && (
            <p className="text-xs text-gray-400 font-medium pt-1">
              + {poll.options.length - 3} more options
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto cursor-default">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User size={12} />
            <span>{poll.identity === 'anonymous' ? 'Anonymous' : (poll.creatorName || 'User')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <BarChart2 size={12} />
            <span>{totalVotes.toLocaleString()} votes</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PollCard;