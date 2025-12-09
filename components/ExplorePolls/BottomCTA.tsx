import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface BottomCTAProps {
    onCreate: () => void;
}

const BottomCTA: React.FC<BottomCTAProps> = ({ onCreate }) => {
    return (
        <div className="mt-32 bg-brand-900 rounded-[32px] p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
            <div className="relative z-10">
                <h2 className="text-4xl font-serif mb-6">Can't find what you're looking for?</h2>
                <p className="text-gray-400 mb-10 text-xl font-light">Ask your own question and let the crowd decide.</p>
                <Button variant="secondary" onClick={onCreate} className="shadow-xl bg-white text-brand-900 border-none hover:bg-gray-100">
                    Create a Poll <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    );
};

export default BottomCTA;
