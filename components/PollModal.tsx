import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, User, Clock, Share2 } from 'lucide-react';
import { Poll } from '../types';
import Button from './ui/Button';

interface PollModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (pollId: string, optionIndex: number) => void;
}

const PollModal: React.FC<PollModalProps> = ({ poll, isOpen, onClose, onVote }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Reset state when poll changes
  React.useEffect(() => {
    if (isOpen) {
      setHasVoted(false);
      setSelectedOption(null);
    }
  }, [isOpen, poll?.id]);

  if (!poll) return null;

  const handleOptionClick = (index: number) => {
    if (hasVoted) return;
    
    setSelectedOption(index);
    setHasVoted(true);
    // Add small delay to simulate network/interaction feel
    setTimeout(() => {
      onVote(poll.id!, index);
    }, 200);
  };

  const totalVotes = poll.totalVotes || 0;
  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {poll.identity === 'anonymous' ? 'A' : 'U'}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-gray-900">
                        {poll.identity === 'anonymous' ? 'Anonymous' : 'Poll Creator'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                         <span>Just now</span>
                         <span>•</span>
                         <span className="uppercase tracking-wide font-medium">{poll.visibility}</span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto">
                 <h2 className="text-2xl font-serif font-medium text-brand-900 mb-8 leading-tight">
                    {poll.question}
                 </h2>

                 <div className="space-y-3">
                    {poll.options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const percent = getPercentage(option.votesCount);

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={hasVoted}
                                className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-300 group ${
                                    hasVoted 
                                        ? 'cursor-default' 
                                        : 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                                }`}
                            >
                                {/* Background Bar for Results */}
                                {hasVoted && (
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 0.6, ease: "circOut" }}
                                        className={`absolute inset-0 h-full ${
                                            isSelected ? 'bg-brand-900/10' : 'bg-gray-100'
                                        }`}
                                    />
                                )}

                                {/* Option Content */}
                                <div className={`relative z-10 p-4 border-2 flex items-center justify-between ${
                                    hasVoted 
                                        ? isSelected ? 'border-brand-900' : 'border-transparent'
                                        : 'border-gray-100 hover:border-brand-900/30 bg-white hover:bg-gray-50'
                                } rounded-xl transition-colors`}>
                                    <span className={`font-medium ${isSelected ? 'text-brand-900' : 'text-gray-700'}`}>
                                        {option.label}
                                    </span>
                                    
                                    {hasVoted ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-brand-900">{percent}%</span>
                                            {isSelected && <Check size={16} className="text-brand-900" />}
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-brand-900 transition-colors" />
                                    )}
                                </div>
                            </button>
                        )
                    })}
                 </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                 <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} /> Ends in 24h
                    </span>
                    <span className="font-medium text-brand-900">
                        {totalVotes.toLocaleString()} Votes
                    </span>
                 </div>
                 
                 <Button variant="ghost" size="sm" icon={<Share2 size={14} />} className="text-gray-500 hover:text-brand-900">
                    Share
                 </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PollModal;