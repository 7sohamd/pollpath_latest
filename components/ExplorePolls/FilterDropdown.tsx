import React from 'react';
import { Search, TrendingUp, Clock, Sparkles, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    activeFilter: 'trending' | 'newest' | 'closing';
    onFilterSelect: (filter: 'trending' | 'newest' | 'closing') => void;
}

const FILTER_OPTIONS = [
    { id: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { id: 'newest' as const, label: 'Newest', icon: Sparkles },
    { id: 'closing' as const, label: 'Closing Soon', icon: Clock }
];

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    isOpen,
    onToggle,
    activeFilter,
    onFilterSelect
}) => {
    const ActiveIcon = FILTER_OPTIONS.find(f => f.id === activeFilter)?.icon || TrendingUp;

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 hover:bg-white/80 border border-gray-200 text-sm font-medium text-gray-700 transition-all"
            >
                <ActiveIcon size={18} />
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={onToggle}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20"
                    >
                        {FILTER_OPTIONS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => {
                                    onFilterSelect(filter.id);
                                    onToggle();
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeFilter === filter.id
                                        ? 'bg-brand-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <filter.icon size={16} />
                                {filter.label}
                            </button>
                        ))}
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default FilterDropdown;
