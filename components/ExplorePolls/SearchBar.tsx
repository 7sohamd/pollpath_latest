import React from 'react';
import { Search } from 'lucide-react';
import FilterDropdown from './FilterDropdown';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    isScrolled: boolean;
    filter: 'trending' | 'newest' | 'closing';
    onFilterChange: (filter: 'trending' | 'newest' | 'closing') => void;
    isFilterOpen: boolean;
    onFilterToggle: () => void;
    isSearchFocused: boolean;
    onSearchFocus: (focused: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    onSearchChange,
    isScrolled,
    filter,
    onFilterChange,
    isFilterOpen,
    onFilterToggle,
    isSearchFocused,
    onSearchFocus
}) => {
    return (
        <div
            className={`flex flex-col md:flex-row gap-4 items-center mb-16 p-2 rounded-2xl shadow-sm border sticky top-6 z-30 transition-all duration-500 ease-in-out ${isScrolled
                    ? 'bg-white/70 backdrop-blur-xl border-white/20 max-w-md mx-auto w-full'
                    : 'bg-white border-gray-200 justify-between max-w-2xl mx-auto w-full'
                } ${isSearchFocused && isScrolled ? 'bg-white/95 backdrop-blur-2xl' : ''}`}
        >
            <div className="relative w-full transition-all duration-500 ease-in-out">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search polls, tags, or topics..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => onSearchFocus(true)}
                    onBlur={() => onSearchFocus(false)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none text-sm transition-all duration-300 text-gray-900 placeholder:text-gray-400 ${isScrolled
                            ? 'bg-white/50 focus:bg-white/100'
                            : 'bg-transparent focus:bg-gray-50'
                        }`}
                />
            </div>

            {/* Filter Dropdown - Hidden when scrolled */}
            {!isScrolled && (
                <FilterDropdown
                    isOpen={isFilterOpen}
                    onToggle={onFilterToggle}
                    activeFilter={filter}
                    onFilterSelect={onFilterChange}
                />
            )}
        </div>
    );
};

export default SearchBar;
