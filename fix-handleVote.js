import fs from 'fs';

const f = 'd:/Downloads/agnik/VIDEOS/pollpath/components/ExplorePolls.tsx';
let content = fs.readFileSync(f, 'utf8');

// Replace the entire handleVote function to remove local state updates
const oldHandleVote = /\/\/ Voting Logic\r?\n  const handleVote = async \(pollId: string, optionIndex: number\): Promise<void> => \{[\s\S]*?toast\.error\('Failed to vote\. Please try again\.'\);[\s\S]*?throw error;[\s\S]*?\};/;

const newHandleVote = `// Voting Logic
  const handleVote = async (pollId: string, optionIndex: number): Promise<void> => {
    // Check authentication
    if (!user) {
      setAuthModalOpen(true);
      throw new Error('Not authenticated');
    }

    console.log('[ExplorePolls] Voting for poll:', pollId, 'option:', optionIndex);

    try {
      // Update Firestore
      await pollService.votePoll(pollId, optionIndex, user.uid);

      // Refetch all polls to get updated voters data
      const freshPolls = await pollService.getPolls();
      console.log('[ExplorePolls] Refetched polls after vote', freshPolls.find(p => p.id === pollId)?.voters);
      setPolls(freshPolls);

      // Update the currently selected poll in the modal
      if (selectedPoll && selectedPoll.id === pollId) {
        const updatedPoll = freshPolls.find(p => p.id === pollId);
        if (updatedPoll) {
          console.log('[ExplorePolls] Updating selectedPoll with fresh data');
          setSelectedPoll(updatedPoll);
        }
      }
      
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('[ExplorePolls] Error voting:', error);
      toast.error('Failed to vote. Please try again.');
      throw error;
    }
  };`;

content = content.replace(oldHandleVote, newHandleVote);

fs.writeFileSync(f, content, 'utf8');
console.log('✅ Fixed ExplorePolls handleVote to only use refetched data');
