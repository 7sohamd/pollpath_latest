import React from 'react';
import { PollTemplate } from '../../types';
import { ArrowRight, Hash, ListChecks } from 'lucide-react';
import PollTemplateIcon from './PollTemplateIcon';

interface PollTemplateCardProps {
    template: PollTemplate;
    onSelect: (template: PollTemplate) => void;
}

// Get unique animated background based on template name
const getTemplateBackground = (templateName: string) => {
    const backgrounds = {
        "City Move": {
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            animationClass: "animate-gradient-xy"
        },
        "Logo Feedback": {
            gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)",
            animationClass: "animate-gradient-x"
        },
        "Lunch Poll": {
            gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 50%, #ffeaa7 100%)",
            animationClass: "animate-gradient-pulse"
        },
        "Event Theme": {
            gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)",
            animationClass: "animate-gradient-xy"
        }
    };

    return backgrounds[templateName as keyof typeof backgrounds] || backgrounds["City Move"];
};

const PollTemplateCard: React.FC<PollTemplateCardProps> = ({ template, onSelect }) => {
    const background = getTemplateBackground(template.name);

    return (
        <div
            onClick={() => onSelect(template)}
            className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer relative overflow-hidden flex flex-col items-center justify-between aspect-square"
            style={{
                boxShadow: 'inset 0 24px 0 0 rgba(255, 255, 255, 1.0)'
            }}
        >
            {/* Animated Background Pattern */}
            <div
                className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${background.animationClass}`}
                style={{
                    background: background.gradient,
                    backgroundSize: '200% 200%'
                }}
            />

            {/* Top Right Info - Poll Type & Option Count */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5 z-10">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-brand-900 rounded-lg shadow-sm">
                    <ListChecks size={11} className="text-white" strokeWidth={2} />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                        {template.data.type === 'single' ? 'Single' : 'Multi'}
                    </span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm">
                    <span className="text-[9px] font-semibold text-gray-700">
                        {template.data.options?.length || 0} Options
                    </span>
                </div>
            </div>

            {/* Hover Action Button - Top Center */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 transform -translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-1 text-sm font-bold text-brand-500">
                    Use <ArrowRight size={14} strokeWidth={2.5} />
                </div>
            </div>

            {/* Top: Icon */}
            <div className="w-48 h-48 flex items-center justify-center flex-shrink-0 relative z-10 mt-2">
                <PollTemplateIcon templateName={template.name} />
            </div>

            {/* Bottom: Content */}
            <div className="flex-1 flex flex-col justify-end text-center relative z-10 w-full mt-2">
                <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                    {template.name}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {template.description}
                </p>

                {/* Tags at Bottom */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {template.data.tags?.slice(0, 2).map((tag, i) => {
                        // Color scheme based on template
                        const getTagColors = () => {
                            switch (template.name) {
                                case "City Move":
                                    return "bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-300 text-purple-700 hover:from-purple-200 hover:to-indigo-200";
                                case "Logo Feedback":
                                    return "bg-gradient-to-r from-pink-100 to-yellow-100 border-pink-300 text-pink-700 hover:from-pink-200 hover:to-yellow-200";
                                case "Lunch Poll":
                                    return "bg-gradient-to-r from-orange-100 to-amber-100 border-orange-300 text-orange-700 hover:from-orange-200 hover:to-amber-200";
                                case "Event Theme":
                                    return "bg-gradient-to-r from-indigo-100 to-pink-100 border-indigo-300 text-indigo-700 hover:from-indigo-200 hover:to-pink-200";
                                default:
                                    return "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-700 hover:from-gray-200 hover:to-gray-300";
                            }
                        };

                        return (
                            <div key={i} className={`flex items-center gap-0.5 px-2.5 py-1 border rounded-full transition-all shadow-sm ${getTagColors()}`}>
                                <Hash size={10} strokeWidth={2.5} />
                                <span className="text-[10px] font-semibold">{tag}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PollTemplateCard;
