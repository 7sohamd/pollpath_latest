import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BarChart3, MessageCircle } from 'lucide-react';

const TemplatesGraphic = () => {
    return (
        <div className="w-full h-full flex items-center justify-center gap-4 relative overflow-hidden px-8">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />

            {[
                { icon: <CheckCircle2 size={18} />, label: "Yes/No", color: "text-emerald-600 bg-emerald-50" },
                { icon: <BarChart3 size={18} />, label: "Rank", color: "text-blue-600 bg-blue-50" },
                { icon: <MessageCircle size={18} />, label: "Open", color: "text-purple-600 bg-purple-50" },
            ].map((t, i) => (
                <motion.div
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    whileHover={{ y: -8, scale: 1.05, zIndex: 10 }}
                    className="w-32 h-44 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col items-center p-4 gap-3 relative transition-all"
                >
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center mb-1`}>
                        {t.icon}
                    </div>
                    <div className="w-12 h-2 bg-gray-100 rounded-full" />
                    <div className="w-full space-y-2 mt-2">
                        <div className="w-full h-8 rounded bg-gray-50 border border-gray-100" />
                        <div className="w-full h-8 rounded bg-gray-50 border border-gray-100" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default TemplatesGraphic;
