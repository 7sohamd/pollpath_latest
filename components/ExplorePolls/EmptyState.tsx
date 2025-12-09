import React from 'react';
import { Search } from 'lucide-react';
import Button from '../ui/Button';

interface EmptyStateProps {
    onCreate: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreate }) => {
    return (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-brand-900 mb-2">No polls found</h3>
            <p className="text-gray-500 mb-8">Try a different keyword or create a new poll.</p>
            <Button onClick={onCreate}>Create a Poll</Button>
        </div>
    );
};

export default EmptyState;
