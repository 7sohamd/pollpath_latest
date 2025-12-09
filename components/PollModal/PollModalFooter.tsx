import React from 'react';
import { Clock, Share2, Check } from 'lucide-react';
import Button from '../ui/Button';

interface PollModalFooterProps {
    totalVotes: number;
    onShare: () => void;
    linkCopied: boolean;
}

const PollModalFooter: React.FC<PollModalFooterProps> = ({
    totalVotes,
    onShare,
    linkCopied
}) => {
    return (
        <div className="p-6 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    <Clock size={14} /> Ends in 24h
                </span>
                <span className="font-medium text-brand-900">
                    {totalVotes.toLocaleString()} Votes
                </span>
            </div>

            <Button
                variant="ghost"
                size="sm"
                icon={linkCopied ? <Check size={14} /> : <Share2 size={14} />}
                className="text-gray-500 hover:text-brand-900"
                onClick={onShare}
            >
                Share
            </Button>
        </div>
    );
};

export default PollModalFooter;
