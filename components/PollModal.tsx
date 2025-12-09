import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import toast from 'react-hot-toast';
import { Poll } from '../types';
import PollModalHeader from './PollModal/PollModalHeader';
import PollOption from './PollModal/PollOption';
import PollModalFooter from './PollModal/PollModalFooter';

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
      let userVotedOptionIndex: number | null = null;

      if (poll.voters) {
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
      setHasVoted(false);
      setSelectedOption(null);
      setIsVoting(false);
    }
  }, [isOpen, poll?.id, JSON.stringify(poll?.voters), user?.uid]);

  if (!poll) return null;

  const handleOptionClick = async (index: number) => {
    if (isVoting) {
      return;
    }
    if (hasVoted && selectedOption === index) {
      return;
    }

    setIsVoting(true);
    const previousSelection = selectedOption;
    setSelectedOption(index);
    setHasVoted(true);

    try {
      await onVote(poll.id!, index);
    } catch (error) {
      console.error("[PollModal] Vote failed:", error);
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
              <PollModalHeader
                poll={poll}
                user={user}
                onClose={onClose}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />

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
                      <PollOption
                        key={idx}
                        option={option}
                        index={idx}
                        isSelected={isSelected}
                        hasVoted={hasVoted}
                        percent={percent}
                        onClick={handleOptionClick}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <PollModalFooter
                totalVotes={totalVotes}
                onShare={handleShareLink}
                linkCopied={linkCopied}
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PollModal;