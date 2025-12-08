import React, { useState } from 'react';
import { Search, TrendingUp, Clock, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PollCard from './ui/PollCard';
import PollModal from './PollModal';
import Button from './ui/Button';
import { Poll } from '../types';

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
}

const ExplorePolls: React.FC<ExplorePollsProps> = ({ onCreate }) => {
  const [polls, setPolls] = useState<Poll[]>(INITIAL_MOCK_POLLS);
  const [filter, setFilter] = useState<'trending' | 'newest' | 'closing'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  // Voting Modal State
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Voting Logic
  const handleVote = (pollId: string, optionIndex: number) => {
    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const newOptions = [...poll.options];
        newOptions[optionIndex] = {
          ...newOptions[optionIndex],
          votesCount: newOptions[optionIndex].votesCount + 1
        };
        return {
          ...poll,
          options: newOptions,
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    });

    setPolls(updatedPolls);

    // Update the currently selected poll in the modal to reflect the vote immediately
    if (selectedPoll && selectedPoll.id === pollId) {
      const updatedPoll = updatedPolls.find(p => p.id === pollId);
      if (updatedPoll) setSelectedPoll(updatedPoll);
    }
  };

  const openPoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setIsModalOpen(true);
  };

  // Filter Logic (Mock)
  const displayedPolls = polls.filter(p =>
    p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-16 bg-white p-2 rounded-2xl shadow-sm border border-gray-200 sticky top-24 z-30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search polls, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent focus:bg-gray-50 focus:outline-none text-sm transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'newest', label: 'Newest', icon: Sparkles },
              { id: 'closing', label: 'Closing Soon', icon: Clock }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === f.id
                    ? 'bg-brand-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </div>
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
        />

      </div>
    </div>
  );
};

export default ExplorePolls;