import fs from 'fs';

const f = 'd:/Downloads/agnik/VIDEOS/pollpath/components/PollModal.tsx';
let content = fs.readFileSync(f, 'utf8');

// Find and replace the entire handleOptionClick function
const lines = content.split('\n');
let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const handleOptionClick = async (index: number) =>')) {
        start = i;
    }
    if (start >= 0 && lines[i].trim() === '};' && lines[i - 1].includes('200)')) {
        end = i;
        break;
    }
}

if (start >= 0 && end >= 0) {
    const newFunction = [
        '  const handleOptionClick = async (index: number) => {',
        '    if (isVoting) return;',
        '    if (hasVoted && selectedOption === index) return;',
        '    ',
        '    setIsVoting(true);',
        '    setSelectedOption(index);',
        '    setHasVoted(true);',
        '    ',
        '    try {',
        '      await onVote(poll.id!, index);',
        '    } catch (error) {',
        '      console.error("Vote failed:", error);',
        '      setIsVoting(false);',
        '    }',
        '  };',
    ];

    lines.splice(start, end - start + 1, ...newFunction);
    content = lines.join('\n');
    fs.writeFileSync(f, content, 'utf8');
    console.log('✅ Fixed PollModal handleOptionClick');
} else {
    console.log('❌ Could not find function to replace');
}
