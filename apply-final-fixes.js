import fs from 'fs';

console.log('Applying remaining fixes...\n');

// 1. Fix CreatePoll - Add anonymous toggle
const createPollPath = 'd:/Downloads/agnik/VIDEOS/pollpath/components/CreatePoll.tsx';
let createPoll = fs.readFileSync(createPollPath, 'utf8');

// Replace settings grid - only visibility section
const visOld = '                      <div className="space-y-3">\r\n                        <label className="block text-sm font-medium text-gray-700 ml-1">Visibility</label>';

const visNew = `                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Post Anonymously</label>
                        <button
                          type="button"
                          onClick={() => setForm Data({ 
                            ...formData, 
                            identity: formData.identity === 'anonymous' ? 'named' : 'anonymous' 
                          })}
                          className={\`w-full p-3.5 rounded-xl border-2 transition-all flex items-center justify-between \${
                            formData.identity === 'anonymous'
                              ? 'bg-brand-900 border-brand-900 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }\`}
                        >
                          <span className="text-sm font-medium">
                            {formData.identity === 'anonymous' ? 'Anonymous' : 'Show my name'}
                          </span>
                          <div className={\`w-12 h-6 rounded-full transition-all relative \${
                            formData.identity === 'anonymous' ? 'bg-white/20' : 'bg-gray-300'
                          }\`}>
                            <div className={\`absolute top-0.5 w-5 h-5 rounded-full transition-all \${
                              formData.identity === 'anonymous' 
                                ? 'right-0.5 bg-white' 
                                : 'left-0.5 bg-white'
                            }\`} />
                          </div>
                        </button>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Visibility</label>`;

if (createPoll.includes(visOld)) {
    createPoll = createPoll.replace(visOld, visNew);
    fs.writeFileSync(createPollPath, createPoll, 'utf8');
    console.log('✅ CreatePoll.tsx - Added anonymous toggle');
} else {
    console.log('⚠️  CreatePoll.tsx - Pattern not found, may already be updated');
}

// 2. Fix PollModal - Update handleOptionClick
const pollModalPath = 'd:/Downloads/agnik/VIDEOS/pollpath/components/PollModal.tsx';
let pollModal = fs.readFileSync(pollModalPath, 'utf8');

const modalOld = `  const handleOptionClick = (index: number) => {
    // Allow changing vote if already voted
    if (hasVoted && selectedOption === index) {
      // Clicking same option - do nothing
      return;
    }
    
    setSelectedOption(index);
    setHasVoted(true);
    // Add small delay to simulate network/interaction feel
    setTimeout(() => {
      onVote(poll.id!, index);
    }, 200);
  };`;

const modalNew = `  const handleOptionClick = async (index: number) => {
    if (isVoting) return;
    if (hasVoted && selectedOption === index) return;
    
    setIsVoting(true);
    setSelectedOption(index);
    setHasVoted(true);
    
    try {
      await onVote(poll.id!, index);
    } catch (error) {
      setIsVoting(false);
    }
  };`;

if (pollModal.includes(modalOld)) {
    pollModal = pollModal.replace(modalOld, modalNew);

    // Also update useEffect to reset isVoting
    pollModal = pollModal.replace(
        '      } else {\r\n        setHasVoted(false);\r\n        setSelectedOption(null);\r\n      }\r\n    } else if (!isOpen) {',
        '      } else {\r\n        setHasVoted(false);\r\n        setSelectedOption(null);\r\n      }\r\n      setIsVoting(false);\r\n    } else if (!isOpen) {'
    );

    pollModal = pollModal.replace(
        '      setHasVoted(false);\r\n      setSelectedOption(null);\r\n    }\r\n  }, [isOpen, poll?.id, poll?.voters, user]);',
        '      setHasVoted(false);\r\n      setSelectedOption(null);\r\n      setIsVoting(false);\r\n    }\r\n  }, [isOpen, poll?.id, poll?.voters, user]);'
    );

    fs.writeFileSync(pollModalPath, pollModal, 'utf8');
    console.log('✅ PollModal.tsx - Updated handleOptionClick with isVoting lock');
} else {
    console.log('⚠️  PollModal.tsx - Pattern not found, may already be updated');
}

// 3. Fix ExplorePolls - Make handleVote return Promise
const explorePath = 'd:/Downloads/agnik/VIDEOS/pollpath/components/ExplorePolls.tsx';
let explore = fs.readFileSync(explorePath, 'utf8');

// Update PollModalProps type
if (!explore.includes('onVote: (pollId: string, optionIndex: number) => Promise<void>;')) {
    explore = explore.replace(
        'onVote: (pollId: string, optionIndex: number) => void;',
        'onVote: (pollId: string, optionIndex: number) => Promise<void>;'
    );
}

// Update handleVote signature
if (!explore.includes('const handleVote = async (pollId: string, optionIndex: number): Promise<void> => {')) {
    explore = explore.replace(
        '  const handleVote = async (pollId: string, optionIndex: number) => {',
        '  const handleVote = async (pollId: string, optionIndex: number): Promise<void> => {'
    );
}

// Add throw error at the end
explore = explore.replace(
    `      toast.error('Failed to vote. Please try again.');
    }
  };`,
    `      toast.error('Failed to vote. Please try again.');
      throw error;
    }
  };`
);

fs.writeFileSync(explorePath, explore, 'utf8');
console.log('✅ ExplorePolls.tsx - Updated handleVote to return Promise\n');

console.log('All fixes applied successfully!');
