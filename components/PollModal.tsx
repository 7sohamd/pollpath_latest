import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, User, Clock, Share2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import toast from 'react-hot-toast';
import { Poll } from '../types';
import Button from './ui/Button';

interface PollModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (pollId: string, optionIndex: number) => void;
  onDelete?: (pollId: string) => void;
}

const PollModal: React.FC<PollModalProps> = ({ poll, isOpen, onClose, onVote, onDelete }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { user } = useAuth();

  const handleShareLink = async () => {
    if (!poll?.id) return;

    const shareUrl = `${window.location.origin}?poll=${poll.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success('Link Copied!');

      // Reset icon after 2 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (!poll?.id || !user) return;

    if (poll.creatorId !== user.uid) {
      toast.error('You can only delete your own polls');
      return;
    }

    if (!confirm('Are you sure you want to delete this poll?')) return;

    setIsDeleting(true);
    try {
      await pollService.deletePoll(poll.id);
      toast.success('Poll deleted successfully');
      onClose();
      if (onDelete) onDelete(poll.id);
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast.error('Failed to delete poll');
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user has already voted when modal opens
  React.useEffect(() => {
    if (isOpen && poll && user) {
      // Check if user has already voted
      let userVotedOptionIndex: number | null = null;

      if (poll.voters) {
        // Check each option's voters array
        for (let i = 0; i < poll.options.length; i++) {
          const optionVoters = poll.voters[i] || [];
          if (optionVoters.includes(user.uid)) {
            userVotedOptionIndex = i;
            break;
          }
        }
      }

      if (userVotedOptionIndex !== null) {
        setHasVoted(true);
        setSelectedOption(userVotedOptionIndex);
      } else {
        setHasVoted(false);
        setSelectedOption(null);
      }
      setIsVoting(false);
    } else if (!isOpen) {
      // Reset when modal closes
      setHasVoted(false);
      setSelectedOption(null);
      setIsVoting(false);
    }
  }, [isOpen, poll?.id, JSON.stringify(poll?.voters), user?.uid]);

  if (!poll) return null;

  const handleOptionClick = async (index: number) => {
    console.log('[PollModal] Option clicked:', index, { isVoting, hasVoted, selectedOption });
    if (isVoting) {
      console.log('[PollModal] Vote in progress, ignoring click');
      return;
    }
    if (hasVoted && selectedOption === index) {
      console.log('[PollModal] Same option clicked, ignoring');
      return;
    }

    console.log('[PollModal] Processing vote for option:', index);
    setIsVoting(true);
    const previousSelection = selectedOption;
    setSelectedOption(index);
    setHasVoted(true);

    try {
      await onVote(poll.id!, index);
      console.log('[PollModal] Vote successful');
      // Vote succeeded - state will update when poll refetches
    } catch (error) {
      console.error("[PollModal] Vote failed:", error);
      // Revert to previous state on error
      setSelectedOption(previousSelection);
      setHasVoted(previousSelection !== null);
      setIsVoting(false);
    }
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
                    {poll.identity === 'anonymous' ? 'A' : (poll.creatorName?.[0]?.toUpperCase() || 'U')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {poll.identity === 'anonymous' ? 'Anonymous' : (poll.creatorName || 'Poll Creator')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Just now</span>
                      <span>•</span>
                      <span className="uppercase tracking-wide font-medium">{poll.visibility}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Delete button - only show to poll creator */}
                  {user && poll.creatorId === user.uid && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete poll"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-900 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
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
                        className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-300 group ${hasVoted
                          ? 'cursor-pointer hover:scale-[1.01]'
                          : 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                          }`}
                      >
                        {/* Background Bar for Results */}
                        {hasVoted && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            className={`absolute inset-0 h-full ${isSelected ? 'bg-brand-900/10' : 'bg-gray-100'
                              }`}
                          />
                        )}

                        {/* Option Content */}
                        <div className={`relative z-10 p-4 border-2 flex items-center justify-between ${hasVoted
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

                <Button
                  variant="ghost"
                  size="sm"
                  icon={linkCopied ? <Check size={14} /> : <Share2 size={14} />}
                  className="text-gray-500 hover:text-brand-900"
                  onClick={handleShareLink}
                >
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