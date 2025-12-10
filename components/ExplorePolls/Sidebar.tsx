import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Sparkles, Lock, Hash, Briefcase, Heart, Gamepad2, Book, Utensils, Plane, Bookmark } from 'lucide-react';

interface SidebarProps {
    activeFilter: 'trending' | 'newest' | 'closing';
    onFilterChange: (filter: 'trending' | 'newest' | 'closing') => void;
    activeCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    showPrivatePolls: boolean;
    onPrivateToggle: () => void;
    showSavedPolls: boolean;
    onSavedToggle: () => void;
    savedCount: number;
    isPro: boolean;
}

const filters = [
    { id: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-orange-500' },
    { id: 'newest', label: 'Latest', icon: Sparkles, color: 'text-blue-500' },
    { id: 'closing', label: 'Closing Soon', icon: Clock, color: 'text-red-500' },
];

const categories = [
    { id: 'tech', label: 'Technology', icon: Hash, color: 'text-purple-500' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'text-blue-600' },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart, color: 'text-pink-500' },
    { id: 'entertainment', label: 'Entertainment', icon: Gamepad2, color: 'text-green-500' },
    { id: 'education', label: 'Education', icon: Book, color: 'text-indigo-500' },
    { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'text-orange-600' },
    { id: 'travel', label: 'Travel', icon: Plane, color: 'text-cyan-500' },
];

const Sidebar: React.FC<SidebarProps> = ({
    activeFilter,
    onFilterChange,
    activeCategory,
    onCategoryChange,
    showPrivatePolls,
    onPrivateToggle,
    showSavedPolls,
    onSavedToggle,
    savedCount,
    isPro,
}) => {
    return (
        <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-4 hidden lg:block w-64 flex-shrink-0"
        >
            <div className="space-y-8">
                {/* Feed Filters */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Feed</h3>
                    <div className="space-y-2">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = activeFilter === filter.id;
                            return (
                                <motion.button
                                    key={filter.id}
                                    onClick={() => onFilterChange(filter.id as any)}
                                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                                            ? 'bg-brand-900 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100/80'
                                        }
                  `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : filter.color}`} />
                                    <span>{filter.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200" />

                {/* Categories */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Topics</h3>
                        {activeCategory && (
                            <button
                                onClick={() => onCategoryChange(null)}
                                className="text-xs text-brand-900 hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === category.id;
                            return (
                                <motion.button
                                    key={category.id}
                                    onClick={() => onCategoryChange(isActive ? null : category.id)}
                                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                                            ? 'bg-gray-100 text-brand-900 border-l-2 border-brand-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-900' : category.color}`} />
                                    <span className="truncate">{category.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200" />

                {/* Collections */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Collections</h3>
                    <div className="space-y-2">
                        {/* Saved Polls */}
                        <motion.button
                            onClick={onSavedToggle}
                            whileHover={{ x: 4, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${showSavedPolls
                                    ? 'bg-amber-100 text-amber-900 border-l-2 border-amber-600'
                                    : 'text-gray-700 hover:bg-gray-100/80'
                                }
              `}
                        >
                            <Bookmark className="w-4 h-4" />
                            <span>Saved</span>
                            {savedCount > 0 && (
                                <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-amber-600 text-white rounded-full">
                                    {savedCount}
                                </span>
                            )}
                        </motion.button>

                        {/* Private Polls - Pro Only */}
                        {isPro && (
                            <motion.button
                                onClick={onPrivateToggle}
                                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${showPrivatePolls
                                        ? 'bg-purple-100 text-purple-900 border-l-2 border-purple-600'
                                        : 'text-gray-700 hover:bg-gray-100/80'
                                    }
                `}
                            >
                                <Lock className="w-4 h-4" />
                                <span>Private Polls</span>
                                <span className="ml-auto text-xs font-bold px-2 py-0.5 bg-purple-600 text-white rounded-full">PRO</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollbar styling */}
            <style>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </motion.aside>
    );
};

export default Sidebar;
