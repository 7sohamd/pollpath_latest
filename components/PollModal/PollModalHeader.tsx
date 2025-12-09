import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Poll } from '../../types';

interface PollModalHeaderProps {
    poll: Poll;
    user: any;
    onClose: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

const PollModalHeader: React.FC<PollModalHeaderProps> = ({
    poll,
    user,
    onClose,
    onDelete,
    isDeleting
}) => {
    return (
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {poll.identity === 'anonymous' ? 'A' : (poll.creatorName?.[0]?.toUpperCase() || 'U')}
                </div>
                <div>
                    <div className="text-sm font-bold text-gray-900">
                        {poll.identity === 'anonymous' ? 'Anonymous' : (poll.creatorName || 'Poll Creator')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Just now</span>
                        <span>•</span>
                        <span className="uppercase tracking-wide font-medium">{poll.visibility}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* Delete button - only show to poll creator */}
                {user && poll.creatorId === user.uid && (
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete poll"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-900 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default PollModalHeader;
