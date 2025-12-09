import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check } from 'lucide-react';

const CreateGraphic = () => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setStatus('sending');

        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setInputValue("");
            }, 2500);
        }, 800);
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            <div className="w-full max-w-[240px] bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 space-y-4">
                <div className="flex gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                </div>

                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="h-24 flex flex-col items-center justify-center gap-3"
                        >
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <Check size={24} />
                            </div>
                            <span className="text-sm font-semibold text-emerald-700">Poll Created!</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Question</label>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your question..."
                                    disabled={status === 'sending'}
                                    className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 transition-all placeholder:text-gray-400 text-gray-800"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || status === 'sending'}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all
                    ${inputValue.trim() && status !== 'sending'
                                            ? 'bg-brand-900 text-white shadow-md hover:shadow-lg active:scale-95'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                  `}
                                >
                                    {status === 'sending' ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Post Poll <Send size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {status === 'idle' && !inputValue && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-20 -right-2 bg-brand-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl pointer-events-none"
                >
                    Try typing something!
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-900" />
                </motion.div>
            )}
        </div>
    );
};

export default CreateGraphic;
