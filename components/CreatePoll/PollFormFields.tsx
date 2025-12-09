import React from 'react';
import { Plus, X } from 'lucide-react';
import { Poll, PollOption } from '../../types';

interface PollFormFieldsProps {
    formData: Partial<Poll>;
    onUpdate: (updates: Partial<Poll>) => void;
    inputStyles: string;
}

const PollFormFields: React.FC<PollFormFieldsProps> = ({ formData, onUpdate, inputStyles }) => {
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
        <div className="space-y-8">
            {/* Question Input */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 ml-1">Poll Question</label>
                <textarea
                    value={formData.question}
                    onChange={(e) => onUpdate({ question: e.target.value })}
                    placeholder="What would you like to ask?"
                    className={`${inputStyles} h-32 resize-none text-lg`}
                />
            </div>

            {/* Options Input */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 ml-1">Options</label>
                <div className="space-y-3">
                    {formData.options?.map((opt, i) => (
                        <div key={i} className="flex gap-3 items-center group">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) => updateOption(i, e.target.value)}
                                    placeholder={`Option ${i + 1}`}
                                    className={inputStyles}
                                />
                            </div>
                            {formData.options!.length > 2 && (
                                <button
                                    onClick={() => removeOption(i)}
                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={addOption}
                    className="text-sm font-medium text-brand-900 hover:text-blue-600 flex items-center gap-2 transition-colors px-1 py-2"
                >
                    <Plus size={16} /> Add another option
                </button>
            </div>
        </div>
    );
};

export default PollFormFields;
