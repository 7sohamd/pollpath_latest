const fs = require('fs');

const pollModalPath = 'd:/Downloads/agnik/VIDEOS/pollpath/components/PollModal.tsx';
let content = fs.readFileSync(pollModalPath, 'utf8');

// Replace the handleOptionClick function completely
content = content.replace(
    /const handleOptionClick = async \(index: number\) => \{[^}]*?\n\s*setSelectedOption\(index\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?onVote\(poll\.id!, index\);[\s\S]*?\}, 200\);[\s\S]*?\};/,
    `const handleOptionClick = async (index: number) => {
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
  };`
);

// Add isVoting reset in useEffect
if (!content.includes('setIsVoting(false);')) {
    // Add after setSelectedOption(null) in the first branch
    content = content.replace(
        'setSelectedOption(null);\n      }\n    } else if (!isOpen) {',
        'setSelectedOption(null);\n      }\n      setIsVoting(false);\n    } else if (!isOpen) {'
    );

    // Add before closing brace of useEffect
    content = content.replace(
        'setSelectedOption(null);\n    }\n  }, [isOpen, poll?.id, poll?.voters, user]);',
        'setSelectedOption(null);\n      setIsVoting(false);\n    }\n  }, [isOpen, poll?.id, poll?.voters, user]);'
    );
}

fs.writeFileSync(pollModalPath, content, 'utf8');
console.log('✅ PollModal.tsx fixed with proper async voting logic');
