import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Eye, Clock, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { RazorpayPaymentData } from '../types';
import toast from 'react-hot-toast';

interface ProPaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    feature: 'unlisted' | 'extended-duration';
}

// Soham

const ProPaywallModal: React.FC<ProPaywallModalProps> = ({ isOpen, onClose, onSuccess, feature }) => {
    const [loading, setLoading] = useState(false);
    const { user, refreshUserData } = useAuth();

    const handleSubscribe = async () => {
        if (!user) {
            toast.error('Please sign in to subscribe');
            return;
        }

        setLoading(true);
        try {
            // Create order
            const orderData = await paymentService.createOrder(user.uid);

            // Open Razorpay checkout
            paymentService.openRazorpayCheckout(
                orderData,
                {
                    name: user.displayName || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    contact: user.phoneNumber || '',
                },
                async (paymentData: RazorpayPaymentData) => {
                    // Verify payment on backend
                    try {
                        const result = await paymentService.verifyPayment(paymentData, user.uid);
                        if (result.success && result.isPro) {
                            // Refresh user data to get updated Pro status
                            await refreshUserData();
                            toast.success('You are now a Pro subscriber!');
                            onSuccess();
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Payment verification error:', error);
                        toast.error(error.message || 'Payment verification failed');
                    } finally {
                        setLoading(false);
                    }
                },
                () => {
                    // User dismissed checkout
                    setLoading(false);
                }
            );
        } catch (error: any) {
            console.error('Order creation error:', error);
            toast.error(error.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    const featureTitle = feature === 'unlisted' ? 'Unlisted Polls' : 'Extended Poll Duration';
    const featureDescription = feature === 'unlisted'
        ? 'Keep your polls private and share them only via link'
        : 'Run polls for longer than 24 hours';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>

                            {/* Pro Badge */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-gradient-to-br from-brand-900 to-blue-600 p-4 rounded-2xl shadow-lg">
                                    <Crown size={32} className="text-white" />
                                </div>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-semibold text-brand-900 mb-2">
                                    This is a Pro feature
                                </h2>
                                <p className="text-gray-600">
                                    <strong>{featureTitle}</strong> {feature === 'unlisted' ? 'are' : 'is'} available on PollPath Pro
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="bg-brand-50/50 rounded-xl p-6 mb-8">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                                    Upgrade to Pro to unlock:
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1 bg-brand-900 rounded-full text-white">
                                            <Eye size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Unlisted Polls</p>
                                            <p className="text-xs text-gray-600">Hide polls from Explore, share via link only</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1 bg-brand-900 rounded-full text-white">
                                            <Clock size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Extended Durations</p>
                                            <p className="text-xs text-gray-600">Set poll durations beyond 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1 bg-brand-900 rounded-full text-white">
                                            <Sparkles size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Permanent Polls</p>
                                            <p className="text-xs text-gray-600">Your polls won't auto-delete after 24 hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="w-full py-3 shadow-xl shadow-brand-900/20"
                                >
                                    {loading ? 'Processing...' : 'Subscribe to Pro'}
                                </Button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProPaywallModal;
