import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Check, Clock } from 'lucide-react';

interface PollData {
  id: string;
  author: string;
  time: string;
  question: string;
  desc: string;
  options: { id: string; label: string; votes: number }[];
  totalVotes: number;
}

const POLL_DATA: PollData[] = [
  {
    id: 'poll-1',
    author: 'Alex Sharma',
    time: '2h ago',
    question: 'Moving for work ✈️',
    desc: 'Frontend dev seeking tech communities.',
    options: [
      { id: 'opt1', label: 'Hyderabad', votes: 1240 },
      { id: 'opt2', label: 'Pune', votes: 1150 },
    ],
    totalVotes: 2390
  },
  {
    id: 'poll-2',
    author: 'Design Team',
    time: '15m ago',
    question: 'New Logo Concept 🎨',
    desc: 'Which vibe fits our rebrand better?',
    options: [
      { id: 'opt1', label: 'Minimalist (A)', votes: 840 },
      { id: 'opt2', label: 'Playful (B)', votes: 320 },
      { id: 'opt3', label: 'Abstract (C)', votes: 550 },
    ],
    totalVotes: 1710
  },
  {
    id: 'poll-3',
    author: 'Product Mgr',
    time: '5m ago',
    question: 'Next Feature Priority 🚀',
    desc: 'What should we ship in Q3?',
    options: [
      { id: 'opt1', label: 'Dark Mode', votes: 2100 },
      { id: 'opt2', label: 'API Access', votes: 800 },
    ],
    totalVotes: 2900
  }
];

const PollCard: React.FC<{ data: PollData }> = ({ data }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [localOptions, setLocalOptions] = useState(data.options);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setHasVoted(true);
    setSelectedId(id);
    setLocalOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );
  };

  const currentTotal = localOptions.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-200/80 overflow-hidden relative z-10 backdrop-blur-sm h-full flex flex-col select-none">
      {/* Header */}
      <div className="p-6 pb-2 border-b border-gray-100/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-white shadow-sm shrink-0">
            <User size={14} className="text-gray-600" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-semibold text-gray-900">{data.author}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">{data.time}</span>
          </div>
        </div>
        <h3 className="text-lg font-serif font-medium text-gray-900 mb-1 leading-tight">
          {data.question}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1">
          {data.desc}
        </p>
      </div>

      {/* Options */}
      <div className="p-4 space-y-2 flex-1">
        {localOptions.map((option) => {
          const percentage = hasVoted
            ? Math.round(((option.votes) / currentTotal) * 100)
            : 0;
          const isSelected = selectedId === option.id;

          return (
            <button
              key={option.id}
              onClick={(e) => { e.stopPropagation(); handleVote(option.id); }}
              disabled={hasVoted}
              className={`relative w-full text-left p-2.5 rounded-lg border transition-all duration-300 overflow-hidden group ${
                hasVoted
                  ? isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-transparent bg-white'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {/* Progress Bar */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className={`absolute inset-y-0 left-0 h-full ${
                    isSelected ? 'bg-gray-200' : 'bg-gray-100'
                  }`}
                />
              )}

              <div className="relative z-10 flex justify-between items-center px-1">
                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                
                {hasVoted ? (
                  <div className="flex items-center gap-2">
                      {isSelected && <Check size={14} className="text-black" />}
                      <span className="text-xs font-bold text-gray-900">{percentage}%</span>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-gray-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="px-6 py-3 bg-gray-50/50 flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide border-t border-gray-100">
          <div className="flex items-center gap-1">
             <Clock size={10} />
             <span>Ends in 2 days</span>
          </div>
          <span>{currentTotal.toLocaleString()} Votes</span>
      </div>
    </div>
  );
};

const PollCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % POLL_DATA.length);
    }, 4000); // Rotate every 4 seconds
    return () => clearInterval(timer);
  }, [isHovered]);

  const getPosition = (i: number) => {
    const len = POLL_DATA.length;
    // Calculate offset: 0 (active), 1 (next), len-1 (prev)
    const offset = (i - index + len) % len;
    
    if (offset === 0) return 'center';
    if (offset === 1) return 'right';
    return 'left';
  };

  const variants = {
    center: { 
      x: '0%', 
      scale: 1, 
      zIndex: 20, 
      opacity: 1, 
      filter: 'blur(0px) brightness(1)' 
    },
    left: { 
      x: '-65%', 
      scale: 0.8, 
      zIndex: 10, 
      opacity: 0.5, 
      filter: 'blur(2px) brightness(0.95)' 
    },
    right: { 
      x: '65%', 
      scale: 0.8, 
      zIndex: 10, 
      opacity: 0.5, 
      filter: 'blur(2px) brightness(0.95)' 
    }
  };

  return (
    <div 
      className="relative w-full max-w-sm mx-auto h-[380px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[120%] bg-gray-200/40 blur-[80px] rounded-full -z-10" />

      {/* Cards Container */}
      <div className="relative w-full h-full perspective-1000">
          {POLL_DATA.map((poll, i) => {
              const position = getPosition(i);
              return (
                  <motion.div
                      key={poll.id}
                      className="absolute top-0 left-0 w-full h-full origin-center will-change-transform"
                      animate={position}
                      variants={variants}
                      transition={{ 
                          duration: 0.7, 
                          type: "spring", 
                          stiffness: 180, 
                          damping: 25 
                      }}
                      style={{ 
                          cursor: position === 'center' ? 'auto' : 'pointer'
                      }}
                      onClick={() => {
                          if (position !== 'center') setIndex(i);
                      }}
                  >
                      {/* Interaction blocker for side cards */}
                      {position !== 'center' && (
                          <div className="absolute inset-0 z-50 rounded-3xl" />
                      )}
                      <PollCard data={poll} />
                  </motion.div>
              );
          })}
      </div>
      
      {/* Pagination Dots */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {POLL_DATA.map((_, i) => (
            <button 
                key={i} 
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-gray-800' : 'w-1.5 bg-gray-300'}`}
            />
        ))}
      </div>
    </div>
  );
};

export default PollCarousel;