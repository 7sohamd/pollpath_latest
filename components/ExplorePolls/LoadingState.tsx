import React from 'react';

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading polls...' }) => {
    return (
        <div className="min-h-screen bg-brand-50 pt-32 pb-20 px-4 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    );
};

export default LoadingState;
