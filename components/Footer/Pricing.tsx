import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';
import { RazorpayPaymentData } from '../../types';
import { PRICING_PLANS } from '../../constants/pricingData';

const Pricing: React.FC = () => {
    const { user, isPro, refreshUserData } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleProUpgrade = async () => {
        if (!user) {
            toast.error('Please sign in to upgrade to Pro');
            return;
        }

        if (isPro) {
            toast('You are already a Pro member!', { icon: '👑' });
            return;
        }

        setLoading(true);
        try {
            const orderData = await paymentService.createOrder(user.uid);

            paymentService.openRazorpayCheckout(
                orderData,
                {
                    name: user.displayName || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    contact: user.phoneNumber || '',
                },
                async (paymentData: RazorpayPaymentData) => {
                    try {
                        const result = await paymentService.verifyPayment(paymentData, user.uid);
                        if (result.success && result.isPro) {
                            await refreshUserData();
                            toast.success('🎉 Welcome to Pro! You now have access to all premium features.');
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
                    setLoading(false);
                }
            );
        } catch (error: any) {
            console.error('Order creation error:', error);
            toast.error(error.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <section id="pricing" className="py-32 bg-white text-gray-900 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-50/50 rounded-full blur-3xl -z-10" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm text-xs font-medium text-gray-500 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-900" />
                        PRICING
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-brand-900 tracking-tight">
                        Fair & Simple <span className="italic text-gray-400">Pricing</span>
                    </h2>
                    <p className="text-gray-500 mt-6 text-lg font-light max-w-xl mx-auto">
                        Start for free. Upgrade when you need the power.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {PRICING_PLANS.map((plan, i) => {
                        const isProPlan = plan.popular;
                        const userIsPro = isPro && isProPlan;

                        return (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8 }}
                                className={`
                  relative p-10 rounded-[40px] flex flex-col overflow-hidden group transition-all duration-500 min-h-[600px]
                  ${plan.popular
                                        ? 'bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.05),0_20px_40px_-10px_rgba(0,0,0,0.1)]'
                                        : 'bg-white border border-gray-100 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02),0_10px_30px_-10px_rgba(0,0,0,0.05)]'}
                `}
                            >
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                                <div className="mb-12 relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-serif font-medium text-brand-900">{plan.name}</h3>
                                        {plan.popular && !userIsPro && <span className="px-3 py-1 bg-brand-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-brand-900/20">Popular</span>}
                                        {userIsPro && (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-brand-900 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-brand-900/20">
                                                <Crown size={12} />
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-6xl font-serif text-brand-900 tracking-tight">{plan.price}</span>
                                        <span className="text-gray-400 text-base font-medium">/mo</span>
                                    </div>
                                    <p className="text-base text-gray-500 font-light leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />

                                <ul className="space-y-6 mb-12 flex-1 relative z-10">
                                    {plan.features.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            <div className={`p-1 rounded-full ${plan.popular ? 'bg-brand-900/5 text-brand-900' : 'bg-gray-100 text-gray-400'} shrink-0`}>
                                                <Check size={12} strokeWidth={2.5} />
                                            </div>
                                            <span className="font-medium">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                {isProPlan ? (
                                    userIsPro ? (
                                        <div className="w-full py-4 px-6 text-center rounded-2xl bg-gradient-to-r from-brand-50 to-blue-50 border-2 border-brand-900/10">
                                            <div className="flex items-center justify-center gap-2 text-brand-900">
                                                <Crown size={18} className="text-brand-900" />
                                                <span className="font-serif font-semibold text-sm">You're already Pro!</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Thank you for your support 💙</p>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleProUpgrade}
                                            disabled={loading}
                                            variant="primary"
                                            className="w-full justify-center py-4 text-sm rounded-2xl shadow-xl shadow-brand-900/10 hover:shadow-brand-900/20"
                                        >
                                            {loading ? 'Processing...' : plan.cta}
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        variant="secondary"
                                        className="w-full justify-center py-4 text-sm rounded-2xl bg-gray-50 border-gray-200 hover:bg-white"
                                    >
                                        {plan.cta}
                                    </Button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
