import React from 'react';

interface CreatePollTabsProps {
    activeTab: 'templates' | 'scratch';
    onTabChange: (tab: 'templates' | 'scratch') => void;
}

const CreatePollTabs: React.FC<CreatePollTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex justify-center mb-10">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                <button
                    onClick={() => onTabChange('templates')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'templates'
                            ? 'bg-brand-900 text-white shadow-md'
                            : 'text-gray-500 hover:text-brand-900 hover:bg-gray-50'
                        }`}
                >
                    Templates
                </button>
                <button
                    onClick={() => onTabChange('scratch')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'scratch'
                            ? 'bg-brand-900 text-white shadow-md'
                            : 'text-gray-500 hover:text-brand-900 hover:bg-gray-50'
                        }`}
                >
                    Start from scratch
                </button>
            </div>
        </div>
    );
};

export default CreatePollTabs;
