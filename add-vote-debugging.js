import fs from 'fs';

const f = 'd:/Downloads/agnik/VIDEOS/pollpath/components/PollModal.tsx';
let content = fs.readFileSync(f, 'utf8');

// Add console logging to debug vote detection
content = content.replace(
    '  // Check if user has already voted when modal opens\n  React.useEffect(() => {',
    `  // Check if user has already voted when modal opens\n  React.useEffect(() => {\n    console.log('[PollModal] useEffect triggered', { isOpen, pollId: poll?.id, hasVoters: !!poll?.voters, userId: user?.uid });`
);

// Add logging when vote is detected
content = content.replace(
    '      if (userVotedOptionIndex !== null) {\n        setHasVoted(true);\n        setSelectedOption(userVotedOptionIndex);',
    `      if (userVotedOptionIndex !== null) {\n        console.log('[PollModal] Previous vote detected:', userVotedOptionIndex);\n        setHasVoted(true);\n        setSelectedOption(userVotedOptionIndex);`
);

// Add logging when no vote detected
content = content.replace(
    '      } else {\n        setHasVoted(false);\n        setSelectedOption(null);',
    `      } else {\n        console.log('[PollModal] No previous vote found');\n        setHasVoted(false);\n        setSelectedOption(null);`
);

// Improve handleOptionClick with better state management
const oldHandler = `  const handleOptionClick = async (index: number) => {
    if (isVoting) return;
    if (hasVoted && selectedOption === index) return;
    
    setIsVoting(true);
    setSelectedOption(index);
    setHasVoted(true);
    
    try {
      await onVote(poll.id!, index);
    } catch (error) {
      console.error("Vote failed:", error);
      setIsVoting(false);
    }
  };`;

const newHandler = `  const handleOptionClick = async (index: number) => {
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
  };`;

content = content.replace(oldHandler, newHandler);

fs.writeFileSync(f, content, 'utf8');
console.log('✅ Added debugging and improved vote handling');
