import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Sparkles, Check } from 'lucide-react';
import { SuggestedPoll, Poll, PollOption } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { pollService } from '../services/pollService';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

interface InChatPollCreatorProps {
    suggestedPoll: SuggestedPoll;
    onPollCreated: (pollId: string) => void;
    onCancel: () => void;
}

const InChatPollCreator: React.FC<InChatPollCreatorProps> = ({
    suggestedPoll,
    onPollCreated,
    onCancel
}) => {
    const { user } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Initialize form data from suggested poll
    const [formData, setFormData] = useState<Partial<Poll>>({
        question: suggestedPoll.question,
        type: 'single',
        options: suggestedPoll.options.map(opt => ({ label: opt, votesCount: 0 })),
        visibility: 'public',
        identity: 'named',
        voters: {},
        allowComments: true,
        resultsVisibility: 'always',
        tags: suggestedPoll.suggestedTags,
        totalVotes: 0,
        status: 'published'
    });

    const updateOption = (index: number, value: string) => {
        const newOptions = [...(formData.options || [])];
        newOptions[index] = { ...newOptions[index], label: value };
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...(formData.options || []), { label: '', votesCount: 0 }]
        });
    };

    const removeOption = (index: number) => {
        if ((formData.options?.length || 0) <= 2) return;
        const newOptions = (formData.options || []).filter((_, i) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (!formData.question || (formData.options?.length || 0) < 2) {
            toast.error("Please fill in a question and at least 2 options.");
            return;
        }

        // Check if all options have labels
        const hasEmptyOptions = formData.options?.some(opt => !opt.label.trim());
        if (hasEmptyOptions) {
            toast.error("All options must have a label.");
            return;
        }

        setIsSubmitting(true);
        try {
            const finalPoll: Omit<Poll, 'id' | 'createdAt'> = {
                ...formData as Omit<Poll, 'id' | 'createdAt'>,
                status: 'published',
                updatedAt: new Date(),
                closesAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                creatorId: user.uid,
                creatorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                creatorEmail: user.email || '',
                voters: {},
                imageUrl: null,
            };

            const pollId = await pollService.createPoll(finalPoll, user.uid);
            toast.success('Poll created successfully!');
            onPollCreated(pollId);
        } catch (error) {
            console.error('Error creating poll:', error);
            toast.error('Failed to create poll. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900 outline-none transition-all text-sm text-gray-900";

    if (!isExpanded) {
        // Compact preview view
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
                    <p className="font-medium text-gray-900 mb-3 text-sm">{formData.question}</p>
                    <div className="space-y-2">
                        {formData.options?.slice(0, 3).map((opt, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-900" />
                                {opt.label}
                            </div>
                        ))}
                        {(formData.options?.length || 0) > 3 && (
                            <div className="text-xs text-gray-500 ml-3.5">
                                +{(formData.options?.length || 0) - 3} more options
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsExpanded(true)}
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
    }

    // Expanded editing view
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-5 bg-white border-2 border-brand-900/20 rounded-2xl shadow-xl"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-900" />
                    <h4 className="font-semibold text-gray-900">Create Your Poll</h4>
                </div>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Question */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Question</label>
                    <textarea
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="What would you like to ask?"
                        className={`${inputClasses} h-20 resize-none`}
                    />
                </div>

                {/* Options */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Options</label>
                    <div className="space-y-2">
                        {formData.options?.map((opt, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) => updateOption(i, e.target.value)}
                                    placeholder={`Option ${i + 1}`}
                                    className={inputClasses}
                                />
                                {(formData.options?.length || 0) > 2 && (
                                    <button
                                        onClick={() => removeOption(i)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addOption}
                        className="text-xs font-medium text-brand-900 hover:text-blue-600 flex items-center gap-1.5 mt-2 transition-colors"
                    >
                        <Plus size={14} /> Add option
                    </button>
                </div>

                {/* Settings Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className={inputClasses}
                        >
                            <option value="single">Single choice</option>
                            <option value="multiple">Multiple choice</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Visibility</label>
                        <select
                            value={formData.visibility}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                            className={inputClasses}
                        >
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                        </select>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Tags</label>
                    <input
                        type="text"
                        placeholder="e.g. tech, programming (comma separated)"
                        value={formData.tags?.join(', ')}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className={inputClasses}
                    />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-700">Post anonymously</span>
                    <button
                        onClick={() => setFormData({
                            ...formData,
                            identity: formData.identity === 'anonymous' ? 'named' : 'anonymous'
                        })}
                        className={`w-11 h-6 rounded-full transition-all relative ${formData.identity === 'anonymous' ? 'bg-brand-900' : 'bg-gray-300'
                            }`}
                    >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${formData.identity === 'anonymous' ? 'right-0.5' : 'left-0.5'
                            }`} />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-brand-900 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-black transition-all shadow-lg shadow-brand-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                Create Poll
                            </>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </motion.div>
    );
};

export default InChatPollCreator;
