import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, CheckCircle2, Eye, Clock, Sparkles } from 'lucide-react';
import Button from './ui/Button';

interface ProSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProSuccessModal: React.FC<ProSuccessModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
                        >
                            {/* Success Animation */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="relative"
                                >
                                    <div className="bg-gradient-to-br from-brand-900 to-blue-600 p-4 rounded-2xl shadow-lg">
                                        <Crown size={40} className="text-white" />
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                                    >
                                        <CheckCircle2 size={20} className="text-white" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-semibold text-brand-900 mb-2">
                                    You're now a Pro!
                                </h2>
                                <p className="text-gray-600">
                                    Congrats! Your PollPath Pro subscription is active.
                                </p>
                            </div>

                            {/* Benefits List */}
                            <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl p-6 mb-8">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                                    You now have access to:
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Eye size={16} className="text-brand-900" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Create unlisted polls</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Clock size={16} className="text-brand-900" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Set poll durations longer than 24 hours</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Sparkles size={16} className="text-brand-900" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Polls never auto-delete</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Button
                                onClick={onClose}
                                className="w-full py-3 shadow-xl shadow-brand-900/20"
                            >
                                Start creating Pro polls
                            </Button>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProSuccessModal;
