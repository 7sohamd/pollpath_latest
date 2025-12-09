import React from 'react';
import { Poll } from '../../types';
import PollCard from '../ui/PollCard';

interface PollSectionProps {
    title: string;
    polls: Poll[];
    onPollClick: (poll: Poll) => void;
    onVote: (pollId: string, optionIndex: number) => void;
    badge?: React.ReactNode;
    showPrivateBadge?: boolean;
}

const PollSection: React.FC<PollSectionProps> = ({
    title,
    polls,
    onPollClick,
    onVote,
    badge,
    showPrivateBadge = false
}) => {
    if (polls.length === 0) return null;

    return (
        <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-brand-900 rounded-full" />
                <h2 className="text-2xl font-serif font-medium text-brand-900 flex items-center gap-2">
                    {title}
                    {badge}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {polls.map((poll) => (
                    <div key={poll.id} className="relative">
                        {showPrivateBadge && (
                            <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                🔒 Private
                            </div>
                        )}
                        <PollCard
                            poll={poll}
                            onClick={() => onPollClick(poll)}
                            onVote={(optionIndex) => onVote(poll.id, optionIndex)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollSection;
