import React from 'react';
import { Poll } from '../../types';
import { DURATION_OPTIONS } from '../../constants/pollDefaults';

interface PollSettingsGridProps {
    formData: Partial<Poll>;
    onUpdate: (updates: Partial<Poll>) => void;
    isPro: boolean;
    durationHours: number;
    onDurationChange: (hours: number) => void;
    onPaywallTrigger: (feature: 'unlisted' | 'extended-duration') => void;
    inputStyles: string;
}

const PollSettingsGrid: React.FC<PollSettingsGridProps> = ({
    formData,
    onUpdate,
    isPro,
    durationHours,
    onDurationChange,
    onPaywallTrigger,
    inputStyles
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            {/* Poll Type */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 ml-1">Poll Type</label>
                <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                    {['single', 'multiple', 'rating'].map((type) => (
                        <button
                            key={type}
                            onClick={() => onUpdate({ type: type as any })}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${formData.type === type
                                    ? 'bg-white text-brand-900 shadow-sm border border-gray-100'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Post Anonymously */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 ml-1">Post Anonymously</label>
                <button
                    type="button"
                    onClick={() => onUpdate({
                        identity: formData.identity === 'anonymous' ? 'named' : 'anonymous'
                    })}
                    className={`w-full p-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${formData.identity === 'anonymous'
                            ? 'bg-brand-900 border-brand-900 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                >
                    <span className="text-sm font-medium">
                        {formData.identity === 'anonymous' ? 'Anonymous' : 'Show my name'}
                    </span>
                    <div className={`w-12 h-6 rounded-full transition-all relative ${formData.identity === 'anonymous' ? 'bg-white/20' : 'bg-gray-300'
                        }`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${formData.identity === 'anonymous'
                                ? 'right-0.5 bg-white'
                                : 'left-0.5 bg-white'
                            }`} />
                    </div>
                </button>
            </div>

            {/* Visibility */}
            <div className="space-y-3 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 ml-1">Visibility</label>
                <div className="relative">
                    <select
                        value={formData.visibility}
                        onChange={(e) => {
                            const newVisibility = e.target.value as 'public' | 'unlisted';
                            if (newVisibility === 'unlisted' && !isPro) {
                                onPaywallTrigger('unlisted');
                                return;
                            }
                            onUpdate({ visibility: newVisibility });
                        }}
                        className={`${inputStyles} appearance-none`}
                    >
                        <option value="public">Public (Visible in Explore)</option>
                        <option value="unlisted">Unlisted (Link only) {!isPro && '🔒 Pro'}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 ml-1">Tags</label>
                <input
                    type="text"
                    placeholder="e.g. travel, tech (comma separated)"
                    value={formData.tags?.join(', ')}
                    onChange={(e) => onUpdate({ tags: e.target.value.split(',').map(t => t.trim()) })}
                    className={inputStyles}
                />
            </div>

            {/* Duration */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 ml-1">
                    Duration {!isPro && durationHours > 24 && <span className="text-xs text-brand-900 font-bold">🔒 Pro</span>}
                </label>
                <div className="relative">
                    <select
                        value={durationHours}
                        onChange={(e) => {
                            const hours = parseInt(e.target.value);
                            if (hours > 24 && !isPro) {
                                onPaywallTrigger('extended-duration');
                                return;
                            }
                            onDurationChange(hours);
                        }}
                        className={`${inputStyles} appearance-none`}
                    >
                        {DURATION_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.proOnly && !isPro}
                            >
                                {option.label} {option.proOnly && !isPro && '🔒'}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollSettingsGrid;
