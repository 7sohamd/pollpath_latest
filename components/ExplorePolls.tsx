import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Filter, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import PollCard from './ui/PollCard';
import PollModal from './PollModal';
import Button from './ui/Button';
import { Poll } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

// Mock Data for Explore
const INITIAL_MOCK_POLLS: Poll[] = [
  {
    id: '1',
    question: "Which city has the best tech scene right now?",
    type: 'single',
    options: [{ label: "Bangalore", votesCount: 1200 }, { label: "Hyderabad", votesCount: 950 }, { label: "Pune", votesCount: 400 }],
    visibility: 'public',
    identity: 'anonymous',
    closesAt: new Date(),
    allowComments: true,
    resultsVisibility: 'always',
    tags: ["tech", "career"],
    imageUrl: null,
    totalVotes: 2550,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    question: "Best framework for 2025?",
    type: 'single',
    options: [{ label: "React", votesCount: 500 }, { label: "Vue", votesCount: 150 }, { label: "Svelte", votesCount: 300 }],
    visibility: 'public',
    identity: 'named',
    closesAt: new Date(),
    allowComments: true,
    resultsVisibility: 'always',
    tags: ["dev", "coding"],
    imageUrl: null,
    totalVotes: 950,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    question: "Remote or Office?",
    type: 'single',
    options: [{ label: "Remote", votesCount: 800 }, { label: "Hybrid", votesCount: 1200 }, { label: "Office", votesCount: 100 }],
    visibility: 'public',
    identity: 'anonymous',
    closesAt: new Date(),
    allowComments: true,
    resultsVisibility: 'always',
    tags: ["work", "lifestyle"],
    imageUrl: null,
    totalVotes: 2100,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    question: "Dark Mode or Light Mode?",
    type: 'single',
    options: [{ label: "Dark", votesCount: 3000 }, { label: "Light", votesCount: 200 }],
    visibility: 'public',
    identity: 'anonymous',
    closesAt: new Date(),
    allowComments: true,
    resultsVisibility: 'always',
    tags: ["design", "ui"],
    imageUrl: null,
    totalVotes: 3200,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    question: "Next vacation spot?",
    type: 'multiple',
    options: [{ label: "Bali", votesCount: 150 }, { label: "Japan", votesCount: 300 }, { label: "Europe", votesCount: 200 }],
    visibility: 'public',
    identity: 'named',
    closesAt: new Date(),
    allowComments: true,
    resultsVisibility: 'always',
    tags: ["travel"],
    imageUrl: null,
    totalVotes: 650,
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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

  const { user } = useAuth();

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
      console.log('[ExplorePolls] Refetched polls', freshPolls.find(p => p.id === pollId)?.voters);
      setPolls(freshPolls);
      // Update the currently selected poll in the modal
      if (selectedPoll && selectedPoll.id === pollId) {
        const updatedPoll = freshPolls.find(p => p.id === pollId);
        if (updatedPoll) {
          console.log('[ExplorePolls] Updating modal with fresh poll');
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
  const displayedPolls = polls.filter(p =>
    p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading polls...</p>
        </div>
      </div>
    );
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
        <div
          className={`flex flex-col md:flex-row gap-4 items-center mb-16 p-2 rounded-2xl shadow-sm border sticky top-6 z-30 transition-all duration-500 ease-in-out ${isScrolled
            ? 'bg-white/70 backdrop-blur-xl border-white/20 max-w-md mx-auto w-full'
            : 'bg-white border-gray-200 justify-between max-w-2xl mx-auto w-full'
            } ${isSearchFocused && isScrolled ? 'bg-white/95 backdrop-blur-2xl' : ''}`}
        >
          <div
            className={`relative w-full transition-all duration-500 ease-in-out`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search polls, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none text-sm transition-all duration-300 text-gray-900 placeholder:text-gray-400 ${isScrolled
                ? 'bg-white/50 focus:bg-white/100'
                : 'bg-transparent focus:bg-gray-50'
                }`}
            />
          </div>


          {/* Filter Dropdown - Hidden when scrolled */}
          {!isScrolled && (
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200 text-sm font-medium text-gray-700 transition-all"
              >
                {filter === 'trending' && <TrendingUp size={18} />}
                {filter === 'newest' && <Sparkles size={18} />}
                {filter === 'closing' && <Clock size={18} />}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFilterOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20"
                  >
                    {[
                      { id: 'trending', label: 'Trending', icon: TrendingUp },
                      { id: 'newest', label: 'Newest', icon: Sparkles },
                      { id: 'closing', label: 'Closing Soon', icon: Clock }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setFilter(f.id as any);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${filter === f.id
                          ? 'bg-brand-900 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <f.icon size={16} />
                        {f.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Trending Section */}
        {filter === 'trending' && !searchQuery && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-brand-900 rounded-full" />
              <h2 className="text-2xl font-serif font-medium text-brand-900">Trending Now</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {polls.slice(0, 3).map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onClick={() => openPoll(poll)}
                  onVote={(optionIndex) => handleVote(poll.id, optionIndex)}
                />
              ))}
            </div>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onClick={() => openPoll(poll)}
                  onVote={(optionIndex) => handleVote(poll.id, optionIndex)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-brand-900 mb-2">No polls found</h3>
              <p className="text-gray-500 mb-8">Try a different keyword or create a new poll.</p>
              <Button onClick={onCreate}>Create a Poll</Button>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-32 bg-brand-900 rounded-[32px] p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-serif mb-6">Can’t find what you’re looking for?</h2>
            <p className="text-gray-400 mb-10 text-xl font-light">Ask your own question and let the crowd decide.</p>
            <Button variant="secondary" onClick={onCreate} className="shadow-xl bg-white text-brand-900 border-none hover:bg-gray-100">
              Create a Poll <ArrowRight size={16} />
            </Button>
          </div>
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