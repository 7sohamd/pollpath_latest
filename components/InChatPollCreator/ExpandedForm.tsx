import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Sparkles, Check } from 'lucide-react';
import { Poll, PollOption } from '../../types';
import AuthModal from '../AuthModal';

interface ExpandedFormProps {
    formData: Partial<Poll>;
    onUpdate: (updates: Partial<Poll>) => void;
    onSubmit: () => void;
    onCollapse: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    authModalOpen: boolean;
    onAuthModalClose: () => void;
}

const ExpandedForm: React.FC<ExpandedFormProps> = ({
    formData,
    onUpdate,
    onSubmit,
    onCollapse,
    onCancel,
    isSubmitting,
    authModalOpen,
    onAuthModalClose
}) => {
    const inputClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-900/20 focus:border-brand-900 outline-none transition-all text-sm text-gray-900";

    const updateOption = (index: number, value: string) => {
        const newOptions = [...(formData.options || [])];
        newOptions[index] = { ...newOptions[index], label: value };
        onUpdate({ options: newOptions });
    };

    const addOption = () => {
        onUpdate({
            options: [...(formData.options || []), { label: '', votesCount: 0 }]
        });
    };

    const removeOption = (index: number) => {
        if ((formData.options?.length || 0) <= 2) return;
        const newOptions = (formData.options || []).filter((_, i) => i !== index);
        onUpdate({ options: newOptions });
    };

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
                    onClick={onCollapse}
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
                        onChange={(e) => onUpdate({ question: e.target.value })}
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
                            onChange={(e) => onUpdate({ type: e.target.value as any })}
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
                            onChange={(e) => onUpdate({ visibility: e.target.value as any })}
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
                        onChange={(e) => onUpdate({ tags: e.target.value.split(',').map(t => t.trim()) })}
                        className={inputClasses}
                    />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-700">Post anonymously</span>
                    <button
                        onClick={() => onUpdate({
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
                        onClick={onSubmit}
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

            <AuthModal isOpen={authModalOpen} onClose={onAuthModalClose} />
        </motion.div>
    );
};

export default ExpandedForm;
