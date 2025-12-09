import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PollModal from './PollModal';
import { Poll } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';
import LoadingState from './ExplorePolls/LoadingState';
import SearchBar from './ExplorePolls/SearchBar';
import PollSection from './ExplorePolls/PollSection';
import EmptyState from './ExplorePolls/EmptyState';
import BottomCTA from './ExplorePolls/BottomCTA';

interface ExplorePollsProps {
  onCreate: () => void;
  sharedPollId?: string | null;
}

const ExplorePolls: React.FC<ExplorePollsProps> = ({ onCreate, sharedPollId }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'trending' | 'newest' | 'closing'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Scroll detection for compact search bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Filter Logic
  const publicPolls = polls.filter(p => p.visibility === 'public' && p.status !== 'deleted');
  const myPrivatePolls = user
    ? polls.filter(p => p.visibility === 'unlisted' && p.creatorId === user.uid && p.status !== 'deleted')
    : [];

  // Filter Logic - apply search only to public polls
  const displayedPolls = publicPolls.filter(p =>
    p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-brand-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-serif font-medium text-brand-900 mb-6 tracking-tight"
          >
            Explore live polls
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-500 max-w-xl mx-auto font-light"
          >
            See what the world is deciding today. Search, filter, and vote on public polls.
          </motion.p>
        </div>

        {/* Search & Filter Toolbar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isScrolled={isScrolled}
          filter={filter}
          onFilterChange={setFilter}
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          isSearchFocused={isSearchFocused}
          onSearchFocus={setIsSearchFocused}
        />

        {/* My Private Polls Section - Pro Users Only */}
        {isPro && myPrivatePolls.length > 0 && !searchQuery && (
          <PollSection
            title="My Private Polls"
            polls={myPrivatePolls}
            onPollClick={openPoll}
            onVote={handleVote}
            badge={<span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full">PRO</span>}
            showPrivateBadge
          />
        )}

        {/* Trending Section */}
        {filter === 'trending' && !searchQuery && (
          <PollSection
            title="Trending Now"
            polls={publicPolls.slice(0, 3)}
            onPollClick={openPoll}
            onVote={handleVote}
          />
        )}

        {/* Main Feed */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gray-200 rounded-full" />
            <h2 className="text-2xl font-serif font-medium text-brand-900">
              {searchQuery ? 'Search Results' : 'All Public Polls'}
            </h2>
          </div>

          {displayedPolls.length > 0 ? (
            <PollSection
              title=""
              polls={displayedPolls}
              onPollClick={openPoll}
              onVote={handleVote}
            />
          ) : (
            <EmptyState onCreate={onCreate} />
          )}
        </div>

        {/* Bottom CTA */}
        <BottomCTA onCreate={onCreate} />

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