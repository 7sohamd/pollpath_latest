import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PollModal from './PollModal';
import { Poll } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';
import SkeletonFeed from './ExplorePolls/SkeletonFeed';
import Sidebar from './ExplorePolls/Sidebar';
import FeedCard from './ExplorePolls/FeedCard';
import BentoGrid from './ExplorePolls/BentoGrid';
import InfiniteScrollFeed from './ExplorePolls/InfiniteScrollFeed';
import BottomCTA from './ExplorePolls/BottomCTA';

interface ExplorePollsProps {
  onCreate: () => void;
  sharedPollId?: string | null;
}

const ExplorePolls: React.FC<ExplorePollsProps> = ({ onCreate, sharedPollId }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'trending' | 'newest' | 'closing'>('trending');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showPrivatePolls, setShowPrivatePolls] = useState(false);
  const [showSavedPolls, setShowSavedPolls] = useState(false);
  const [savedPollIds, setSavedPollIds] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  const { user, isPro } = useAuth();

  // Voting Modal State
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch polls from Firestore on mount
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const fetchedPolls = await pollService.getPolls();
        setPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Load saved polls from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPolls');
    if (saved) {
      setSavedPollIds(JSON.parse(saved));
    }
  }, []);

  // Save poll toggle
  const handleSavePoll = (pollId: string) => {
    setSavedPollIds(prev => {
      const newSaved = prev.includes(pollId)
        ? prev.filter(id => id !== pollId)
        : [...prev, pollId];
      localStorage.setItem('savedPolls', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Handle shared poll link - auto-open poll modal
  useEffect(() => {
    if (sharedPollId && polls.length > 0) {
      const poll = polls.find(p => p.id === sharedPollId);
      if (poll) {
        setSelectedPoll(poll);
        setIsModalOpen(true);
      }
    }
  }, [sharedPollId, polls]);

  // Voting Logic
  const handleVote = async (pollId: string, optionIndex: number): Promise<void> => {
    // Check authentication
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      // Update Firestore
      await pollService.votePoll(pollId, optionIndex, user.uid);

      // Update local state
      const freshPolls = await pollService.getPolls();
      setPolls(freshPolls);
      // Update the currently selected poll in the modal
      if (selectedPoll && selectedPoll.id === pollId) {
        const updatedPoll = freshPolls.find(p => p.id === pollId);
        if (updatedPoll) {
          setSelectedPoll(updatedPoll);
        }
      }
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleDelete = async (pollId: string) => {
    // Refresh polls after deletion
    const updatedPolls = await pollService.getPolls();
    setPolls(updatedPolls);
  };

  const openPoll = (poll: Poll) => {
    // Check if user is authenticated before opening modal
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedPoll(poll);
    setIsModalOpen(true);
  };

  // Filter and Category Logic
  let filteredPolls = polls.filter(p => p.status !== 'deleted');

  // Apply saved filter
  if (showSavedPolls) {
    filteredPolls = filteredPolls.filter(p => savedPollIds.includes(p.id!));
  } else {
    // Apply visibility filter (only when not showing saved)
    if (showPrivatePolls && isPro) {
      filteredPolls = filteredPolls.filter(p => p.visibility === 'unlisted' && p.creatorId === user?.uid);
    } else {
      filteredPolls = filteredPolls.filter(p => p.visibility === 'public');
    }
  }

  // Apply category filter
  if (activeCategory) {
    filteredPolls = filteredPolls.filter(p =>
      p.tags && p.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
    );
  }

  // Apply sort filter
  const sortedPolls = [...filteredPolls].sort((a, b) => {
    if (filter === 'trending') {
      const aVotes = a.options.reduce((sum, opt) => sum + opt.votesCount, 0);
      const bVotes = b.options.reduce((sum, opt) => sum + opt.votesCount, 0);
      return bVotes - aVotes;
    } else if (filter === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filter === 'closing') {
      if (!a.closesAt) return 1;
      if (!b.closesAt) return -1;
      return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime();
    }
    return 0;
  });

  // Infinite scroll pagination
  const displayedPolls = sortedPolls.slice(0, displayCount);
  const hasMore = displayedPolls.length < sortedPolls.length;

  const loadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar - Show even during loading */}
            <Sidebar
              activeFilter={filter}
              onFilterChange={setFilter}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              showPrivatePolls={showPrivatePolls}
              onPrivateToggle={() => setShowPrivatePolls(!showPrivatePolls)}
              showSavedPolls={showSavedPolls}
              onSavedToggle={() => setShowSavedPolls(!showSavedPolls)}
              savedCount={savedPollIds.length}
              isPro={isPro || false}
            />

            {/* Main Feed with Skeletons */}
            <main className="flex-1 min-w-0">
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-medium text-brand-900 mb-2">Loading Polls...</h2>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
              <SkeletonFeed count={12} />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-Column Layout: Sidebar + Feed */}
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <Sidebar
            activeFilter={filter}
            onFilterChange={setFilter}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            showPrivatePolls={showPrivatePolls}
            onPrivateToggle={() => setShowPrivatePolls(!showPrivatePolls)}
            showSavedPolls={showSavedPolls}
            onSavedToggle={() => setShowSavedPolls(!showSavedPolls)}
            savedCount={savedPollIds.length}
            isPro={isPro || false}
          />

          {/* Main Feed */}
          <main className="flex-1 min-w-0">
            {/* Feed Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-serif font-medium text-brand-900 mb-2">
                {showSavedPolls
                  ? 'Saved Polls'
                  : activeCategory
                    ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Polls`
                    : showPrivatePolls && isPro
                      ? 'My Private Polls'
                      : filter === 'trending'
                        ? 'Trending Polls'
                        : filter === 'newest'
                          ? 'Latest Polls'
                          : 'Closing Soon'}
              </h2>
              <p className="text-gray-500">
                {displayedPolls.length} poll{displayedPolls.length !== 1 ? 's' : ''} available
              </p>
            </motion.div>

            {/* Bento Grid Feed with Infinite Scroll */}
            {displayedPolls.length > 0 ? (
              <InfiniteScrollFeed
                hasMore={hasMore}
                onLoadMore={loadMore}
                loading={false}
              >
                <BentoGrid>
                  {displayedPolls.map((poll, index) => (
                    <FeedCard
                      key={poll.id}
                      poll={poll}
                      onClick={() => openPoll(poll)}
                      onSave={handleSavePoll}
                      isSaved={savedPollIds.includes(poll.id!)}
                      index={index}
                      featured={filter === 'trending' && index < 3}
                    />
                  ))}
                </BentoGrid>
              </InfiniteScrollFeed>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-400 text-lg mb-6">
                  {activeCategory
                    ? `No polls found in ${activeCategory}`
                    : 'No polls available'}
                </p>
                <button
                  onClick={onCreate}
                  className="px-6 py-3 bg-brand-900 text-white rounded-xl hover:bg-black transition-colors"
                >
                  Create the first poll
                </button>
              </motion.div>
            )}

            {/* Bottom CTA */}
            <div className="mt-16">
              <BottomCTA onCreate={onCreate} />
            </div>
          </main>
        </div>

        {/* Modal */}
        <PollModal
          poll={selectedPoll}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onVote={handleVote}
          onDelete={handleDelete}
        />

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      </div>
    </div>
  );
};

export default ExplorePolls;