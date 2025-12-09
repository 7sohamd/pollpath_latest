import React from 'react';
import { Calendar, Lightbulb } from 'lucide-react';
import { Poll } from '../../types';

interface PollPreviewProps {
    formData: Partial<Poll>;
}

const PollPreview: React.FC<PollPreviewProps> = ({ formData }) => {
    return (
        <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 space-y-4">
                {/* Preview Header */}
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                </div>

                {/* Preview Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                    {/* Decorative bg element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-50 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Poll Creator */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold shadow-md">
                                You
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-900">Your Name</div>
                                <div className="text-[10px] text-gray-400 font-medium">Just now</div>
                            </div>
                            <div className="ml-auto">
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                    {formData.type}
                                </span>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-6">
                            <h3 className={`text-lg font-serif font-medium text-gray-900 leading-tight ${!formData.question ? 'text-gray-300 italic' : ''
                                }`}>
                                {formData.question || "Your question will appear here..."}
                            </h3>
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5">
                            {formData.options?.map((opt, i) => (
                                <div
                                    key={i}
                                    className="group p-3.5 rounded-xl border border-gray-200 bg-gray-50/30 text-sm text-gray-600 flex justify-between items-center hover:border-gray-300 transition-colors cursor-default"
                                >
                                    <span>{opt.label || `Option ${i + 1}`}</span>
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-gray-400" />
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                            <span>0 Votes</span>
                            <span className="flex items-center gap-1"><Calendar size={10} /> Ends in 24h</span>
                        </div>
                    </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                    <div className="mt-0.5 p-1 bg-blue-100 rounded-full text-blue-600">
                        <Lightbulb size={14} />
                    </div>
                    <p className="text-xs text-blue-900/70 leading-relaxed">
                        <strong>Pro Tip:</strong> Short, clear questions get 30% more engagement. Try adding a relevant image to boost visibility.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PollPreview;
