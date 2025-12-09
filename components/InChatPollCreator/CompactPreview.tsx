import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PollOption } from '../../types';

interface CompactPreviewProps {
    question: string;
    options: PollOption[];
    onExpand: () => void;
    onCancel: () => void;
}

const CompactPreview: React.FC<CompactPreviewProps> = ({
    question,
    options,
    onExpand,
    onCancel
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-5 bg-gradient-to-br from-brand-900/5 to-purple-500/5 border-2 border-brand-900/20 rounded-2xl"
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-brand-900 rounded-lg text-white">
                    <Sparkles size={16} />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Create This Poll</h4>
                    <p className="text-xs text-gray-600">I've prepared a poll for you based on your question</p>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-brand-900/10">
                <p className="font-medium text-gray-900 mb-3 text-sm">{question}</p>
                <div className="space-y-2">
                    {options.slice(0, 3).map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-900" />
                            {opt.label}
                        </div>
                    ))}
                    {options.length > 3 && (
                        <div className="text-xs text-gray-500 ml-3.5">
                            +{options.length - 3} more options
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onExpand}
                    className="flex-1 bg-brand-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-all shadow-lg shadow-brand-900/20"
                >
                    Edit & Create
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                >
                    Cancel
                </button>
            </div>
        </motion.div>
    );
};

export default CompactPreview;
