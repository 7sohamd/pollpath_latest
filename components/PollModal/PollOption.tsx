import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PollOption as PollOptionType } from '../../types';

interface PollOptionProps {
    option: PollOptionType;
    index: number;
    isSelected: boolean;
    hasVoted: boolean;
    percent: number;
    onClick: (index: number) => void;
}

const PollOption: React.FC<PollOptionProps> = ({
    option,
    index,
    isSelected,
    hasVoted,
    percent,
    onClick
}) => {
    return (
        <button
            onClick={() => onClick(index)}
            className={`relative w-full text-left rounded-xl overflow-hidden transition-all duration-300 group ${hasVoted
                    ? 'cursor-pointer hover:scale-[1.01]'
                    : 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                }`}
        >
            {/* Background Bar for Results */}
            {hasVoted && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className={`absolute inset-0 h-full ${isSelected ? 'bg-brand-900/10' : 'bg-gray-100'
                        }`}
                />
            )}

            {/* Option Content */}
            <div
                className={`relative z-10 p-4 border-2 flex items-center justify-between ${hasVoted
                        ? isSelected ? 'border-brand-900' : 'border-transparent'
                        : 'border-gray-100 hover:border-brand-900/30 bg-white hover:bg-gray-50'
                    } rounded-xl transition-colors`}
            >
                <span className={`font-medium ${isSelected ? 'text-brand-900' : 'text-gray-700'}`}>
                    {option.label}
                </span>

                {hasVoted ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-brand-900">{percent}%</span>
                        {isSelected && <Check size={16} className="text-brand-900" />}
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-brand-900 transition-colors" />
                )}
            </div>
        </button>
    );
};

export default PollOption;
