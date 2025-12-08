const fs = require('fs');

console.log('Applying fixes...\n');

// Fix 1: ExplorePolls - remove local poll update
console.log('1. Fixing vote duplication in ExplorePolls.tsx...');
let explore = fs.readFileSync('./components/ExplorePolls.tsx', 'utf8');
if (explore.includes('// Update local state')) {
    explore = explore.replace(
        /\/\/ Update local state[\s\S]*?if \(updatedPoll\) setSelectedPoll\(updatedPoll\);[\s\S]*?}/m,
        `// Refresh polls from Firestore to get accurate counts
      const updatedPolls = await pollService.getPolls();
      setPolls(updatedPolls);

      // Update the currently selected poll in the modal
      if (selectedPoll && selectedPoll.id === pollId) {
        const updatedPoll = updatedPolls.find(p => p.id === pollId);
        if (updatedPoll) setSelectedPoll(updatedPoll);
      }`
    );
    fs.writeFileSync('./components/ExplorePolls.tsx', explore, 'utf8');
    console.log('   ✓ Fixed\n');
} else {
    console.log('   ⚠ Already fixed\n');
}

// Fix 2: PollModal - add Trash2 and useAuth
console.log('2. Adding delete to PollModal.tsx...');
let modal = fs.readFileSync('./components/PollModal.tsx', 'utf8');
if (!modal.includes('Trash2')) {
    modal = modal.replace('Share2 }', 'Share2, Trash2 }');
    modal = modal.replace(
        "import Button from './ui/Button';",
        "import Button from './ui/Button';\nimport { useAuth } from '../contexts/AuthContext';\nimport { pollService } from '../services/pollService';\nimport toast from 'react-hot-toast';"
    );
    modal = modal.replace(
        '({ poll, isOpen, onClose, onVote })',
        '({ poll, isOpen, onClose, onVote, onDelete })'
    );
    modal = modal.replace(
        'onVote: (pollId: string, optionIndex: number) => void;',
        'onVote: (pollId: string, optionIndex: number) => void;\n  onDelete?: (pollId: string) => void;'
    );
    fs.writeFileSync('./components/PollModal.tsx', modal, 'utf8');
    console.log('   ✓ Added imports\n');
} else {
    console.log('   ⚠ Already updated\n');
}

// Fix 3: CreatePoll - add anonymous toggle
console.log('3. Adding anonymous toggle to CreatePoll.tsx...');
let create = fs.readFileSync('./components/CreatePoll.tsx', 'utf8');
if (!create.includes('Post Anonymously')) {
    const toggle = '\n                      <div className="space-y-3">\n                        <label className="flex items-center justify-between cursor-pointer">\n                          <span className="text-sm font-medium text-gray-700">Post Anonymously</span>\n                          <div\n                            onClick={() => setFormData({...formData, identity: formData.identity === \'anonymous\' ? \'named\' : \'anonymous\'})}\n                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.identity === \'anonymous\' ? \'bg-brand-900\' : \'bg-gray-200\'}`}\n                          >\n                            <span\n                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.identity === \'anonymous\' ? \'translate-x-6\' : \'translate-x-1\'}`}\n                            />\n                          </div>\n                        </label>\n                        <p className="text-xs text-gray-500">Hide your name from other voters</p>\n                      </div>\n';

    create = create.replace(
        '<label className="block text-sm font-medium text-gray-700 ml-1">Duration</label>',
        toggle + '                      <div className="space-y-3">\n                        <label className="block text-sm font-medium text-gray-700 ml-1">Duration</label>'
    );
    fs.writeFileSync('./components/CreatePoll.tsx', create, 'utf8');
    console.log('   ✓ Added toggle\n');
} else {
    console.log('   ⚠ Already updated\n');
}

// Fix 4: ExplorePolls - add onDelete prop
if (!explore.includes('onDelete={handleDelete}')) {
    explore = fs.readFileSync('./components/ExplorePolls.tsx', 'utf8');
    explore = explore.replace(
        'onVote={handleVote}\n        />',
        'onVote={handleVote}\n          onDelete={handleDelete}\n        />');
    fs.writeFileSync('./components/ExplorePolls.tsx', explore, 'utf8');
    console.log('4. ✓ Added onDelete prop\n');
}

console.log('✅ Done! Manual steps:');
console.log('- Add handleDelete function and delete button UI to PollModal.tsx');
