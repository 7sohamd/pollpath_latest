import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Check, Clock } from 'lucide-react';
import { PollData } from '../../constants/mockPollData';

interface PollCardProps {
    data: PollData;
}

const PollCard: React.FC<PollCardProps> = ({ data }) => {
    const [hasVoted, setHasVoted] = useState(false);
    const [localOptions, setLocalOptions] = useState(data.options);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleVote = (id: string) => {
        if (hasVoted) return;
        setHasVoted(true);
        setSelectedId(id);
        setLocalOptions((prev) =>
            prev.map((opt) =>
                opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
            )
        );
    };

    const currentTotal = localOptions.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-200/80 overflow-hidden relative z-10 backdrop-blur-sm h-full flex flex-col select-none">
            {/* Header */}
            <div className="p-6 pb-2 border-b border-gray-100/50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-white shadow-sm shrink-0">
                        <User size={14} className="text-gray-600" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xs font-semibold text-gray-900">{data.author}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{data.time}</span>
                    </div>
                </div>
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-1 leading-tight">
                    {data.question}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                    {data.desc}
                </p>
            </div>

            {/* Options */}
            <div className="p-4 space-y-2 flex-1">
                {localOptions.map((option) => {
                    const percentage = hasVoted
                        ? Math.round(((option.votes) / currentTotal) * 100)
                        : 0;
                    const isSelected = selectedId === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={(e) => { e.stopPropagation(); handleVote(option.id); }}
                            disabled={hasVoted}
                            className={`relative w-full text-left p-2.5 rounded-lg border transition-all duration-300 overflow-hidden group ${hasVoted
                                    ? isSelected
                                        ? 'border-gray-900 bg-gray-50'
                                        : 'border-transparent bg-white'
                                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            {/* Progress Bar */}
                            {hasVoted && (
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className={`absolute inset-y-0 left-0 h-full ${isSelected ? 'bg-gray-200' : 'bg-gray-100'
                                        }`}
                                />
                            )}

                            <div className="relative z-10 flex justify-between items-center px-1">
                                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                                    {option.label}
                                </span>

                                {hasVoted ? (
                                    <div className="flex items-center gap-2">
                                        {isSelected && <Check size={14} className="text-black" />}
                                        <span className="text-xs font-bold text-gray-900">{percentage}%</span>
                                    </div>
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-gray-500" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="px-6 py-3 bg-gray-50/50 flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide border-t border-gray-100">
                <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>Ends in 2 days</span>
                </div>
                <span>{currentTotal.toLocaleString()} Votes</span>
            </div>
        </div>
    );
};

export default PollCard;
