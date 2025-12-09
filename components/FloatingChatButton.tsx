import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isOpen }) => {
    if (isOpen) return null; // Hide when chat is open

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-900 text-white shadow-2xl hover:bg-black transition-colors z-[75] flex items-center justify-center group"
            aria-label="Open chat"
        >
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />

            {/* Pulse animation ring */}
            <span className="absolute inset-0 rounded-full bg-brand-900 animate-ping opacity-20" />
        </motion.button>
    );
};

export default FloatingChatButton;
