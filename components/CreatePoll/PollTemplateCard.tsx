import React from 'react';
import { PollTemplate } from '../../types';
import { ArrowRight } from 'lucide-react';
import PollTemplateIcon from './PollTemplateIcon';

interface PollTemplateCardProps {
    template: PollTemplate;
    onSelect: (template: PollTemplate) => void;
}

const PollTemplateCard: React.FC<PollTemplateCardProps> = ({ template, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(template)}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer relative overflow-hidden flex items-center justify-between gap-4"
        >
            {/* Top Right Action */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 z-10 pb-2">
                Use template <ArrowRight size={12} />
            </div>

            {/* Left Side: Content */}
            <div className="flex-1 pr-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>
            </div>

            {/* Right Side: Micro-interaction */}
            <div className="w-28 h-28 flex items-center justify-center flex-shrink-0">
                <PollTemplateIcon templateName={template.name} />
            </div>
        </div>
    );
};

export default PollTemplateCard;
