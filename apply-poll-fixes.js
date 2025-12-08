import fs from 'fs';

// Helper to replace content in file
function replaceInFile(filePath, searchStr, replaceStr) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(searchStr, replaceStr);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
}

// 1. Update CreatePoll - Add anonymous toggle
const createPollPath = 'd:\\\\Downloads\\\\agnik\\\\VIDEOS\\\\pollpath\\\\components\\\\CreatePoll.tsx';
const createPollSearch = String.raw`                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Poll Type</label>
                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                          {['single', 'multiple', 'rating'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setFormData({ ...formData, type: type as any })}
                              className={` + '`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${formData.type === type' + String.raw`
                                  ? 'bg-white text-brand-900 shadow-sm border border-gray-100'
                                  : 'text-gray-500 hover:text-gray-900'
                                }` + '`}' + String.raw`
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Visibility</label>
                        <div className="relative">
                          <select
                            value={formData.visibility}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                            className={` + '`${inputBaseClasses} appearance-none`' + String.raw`}>
                            <option value="public">Public (Visible in Explore)</option>
                            <option value="unlisted">Unlisted (Link only)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Tags</label>
                        <input
                          type="text"
                          placeholder="e.g. travel, tech (comma separated)"
                          value={formData.tags?.join(', ')}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                          className={inputBaseClasses}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Duration</label>
                        <div className={` + '`flex items-center gap-2 ${inputBaseClasses} bg-gray-50 text-gray-400 cursor-not-allowed`' + String.raw`}>
                          <Calendar size={16} />
                          <span>24 Hours (Default)</span>
                        </div>
                      </div>
                    </div>`;

const createPollReplace = String.raw`                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Poll Type</label>
                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                          {['single', 'multiple', 'rating'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setFormData({ ...formData, type: type as any })}
                              className={` + '`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${formData.type === type' + String.raw`
                                  ? 'bg-white text-brand-900 shadow-sm border border-gray-100'
                                  : 'text-gray-500 hover:text-gray-900'
                                }` + '`}' + String.raw`
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Post Anonymously</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            identity: formData.identity === 'anonymous' ? 'named' : 'anonymous' 
                          })}
                          className={` + '`w-full p-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${' + String.raw`
                            formData.identity === 'anonymous'
                              ? 'bg-brand-900 border-brand-900 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }` + '`}' + String.raw`
                        >
                          <span className="text-sm font-medium">
                            {formData.identity === 'anonymous' ? 'Anonymous' : 'Show my name'}
                          </span>
                          <div className={` + '`w-12 h-6 rounded-full transition-all relative ${' + String.raw`
                            formData.identity === 'anonymous' ? 'bg-white/20' : 'bg-gray-300'
                          }` + '`}>' + String.raw`
                            <div className={` + '`absolute top-0.5 w-5 h-5 rounded-full transition-all ${' + String.raw`
                              formData.identity === 'anonymous' 
                                ? 'right-0.5 bg-white' 
                                : 'left-0.5 bg-white'
                            }` + '`} />' + String.raw`
                          </div>
                        </button>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Visibility</label>
                        <div className="relative">
                          <select
                            value={formData.visibility}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                            className={` + '`${inputBaseClasses} appearance-none`' + String.raw`}>
                            <option value="public">Public (Visible in Explore)</option>
                            <option value="unlisted">Unlisted (Link only)</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Tags</label>
                        <input
                          type="text"
                          placeholder="e.g. travel, tech (comma separated)"
                          value={formData.tags?.join(', ')}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                          className={inputBaseClasses}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 ml-1">Duration</label>
                        <div className={` + '`flex items-center gap-2 ${inputBaseClasses} bg-gray-50 text-gray-400 cursor-not-allowed`' + String.raw`}>
                          <Calendar size={16} />
                          <span>24 Hours (Default)</span>
                        </div>
                      </div>
                    </div>`;

try {
    console.log('Updating CreatePoll.tsx...');
    replaceInFile(createPollPath, createPollSearch, createPollReplace);
    console.log('✓ CreatePoll.tsx updated with anonymous toggle');
} catch (e) {
    console.error('Error updating CreatePoll.tsx:', e.message);
}

// 2. Update ExplorePolls - improve voting logic
const explorePollsPath = 'd:\\\\Downloads\\\\agnik\\\\VIDEOS\\\\pollpath\\\\components\\\\ExplorePolls.tsx';
const explorePollsSearch = String.raw`  // Voting Logic
  const handleVote = async (pollId: string, optionIndex: number) => {
    // Check authentication
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      // Update Firestore
      await pollService.votePoll(pollId, optionIndex, user.uid);

      // Update local state
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

      // Update the currently selected poll in the modal
      if (selectedPoll && selectedPoll.id === pollId) {
        const updatedPoll = updatedPolls.find(p => p.id === pollId);
        if (updatedPoll) setSelectedPoll(updatedPoll);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };`;

const explorePollsReplace = String.raw`  // Voting Logic
  const handleVote = async (pollId: string, optionIndex: number) => {
    // Check authentication
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      // Update Firestore
      await pollService.votePoll(pollId, optionIndex, user.uid);

      // Refetch all polls to get updated voters data
      const freshPolls = await pollService.getPolls();
      setPolls(freshPolls);

      // Update the currently selected poll in the modal
      if (selectedPoll && selectedPoll.id === pollId) {
        const updatedPoll = freshPolls.find(p => p.id === pollId);
        if (updatedPoll) setSelectedPoll(updatedPoll);
      }
      
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote. Please try again.');
    }
  };`;

try {
    console.log('\nUpdating ExplorePolls.tsx...');
    replaceInFile(explorePollsPath, explorePollsSearch, explorePollsReplace);
    console.log('✓ ExplorePolls.tsx updated with improved voting');
} catch (e) {
    console.error('Error updating ExplorePolls.tsx:', e.message);
}

// 3. Update PollCard - remove voting logic
const pollCardPath = 'd:\\\\Downloads\\\\agnik\\\\VIDEOS\\\\pollpath\\\\components\\\\ui\\\\PollCard.tsx';
const pollCardContent = fs.readFileSync(pollCardPath, 'utf8');

// Remove hasVoted and selectedOption state declarations
let newPollCardContent = pollCardContent.replace(
    /const \[hasVoted, setHasVoted\] = useState\(false\);\r?\n  const \[selectedOption, setSelectedOption\] = useState<number \| null>\(null\);/,
    ''
);

// Simplify handleOptionClick
newPollCardContent = newPollCardContent.replace(
    /const handleOptionClick = \(e: React\.MouseEvent, index: number\) => \{\r?\n    e\.stopPropagation\(\); \/\/ Prevent card click\r?\n    if \(hasVoted \|\| isClosed\) return;\r?\n\r?\n    setSelectedOption\(index\);\r?\n    setHasVoted\(true\);\r?\n    if \(onVote\) \{\r?\n      onVote\(index\);\r?\n    \}\r?\n  \};/,
    `const handleOptionClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent card click
    // Don't allow voting from card - open modal instead
    if (onClick) {
      onClick();
    }
  };`
);

// Remove isSelected variable and update JSX
newPollCardContent = newPollCardContent.replace(
    /const isSelected = selectedOption === idx;\r?\n/g,
    ''
);

newPollCardContent = newPollCardContent.replace(
    /className=\{`relative cursor-pointer group\/option`\}\r?\n                onClick=\{\(e\) => handleOptionClick\(e, idx\)\}/,
    'className="relative group/option"'
);

newPollCardContent = newPollCardContent.replace(
    /\$\{isSelected \? 'text-brand-900' : ''\}/g,
    ''
);

newPollCardContent = newPollCardContent.replace(
    /\$\{isSelected \? 'bg-brand-900' : 'bg-brand-900\/70 group-hover\/option:bg-brand-900'\}/,
    'bg-brand-900/70 group-hover/option:bg-brand-900'
);

fs.writeFileSync(pollCardPath, newPollCardContent, 'utf8');
console.log('\n✓ PollCard.tsx updated to be view-only');

console.log('\n✅ All files updated successfully!');
