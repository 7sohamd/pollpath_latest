import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Twitter, Facebook, Linkedin, MessageCircle, Copy, Share2 } from 'lucide-react';

const ShareGraphic = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border border-brand-900/5"
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: 320, height: 320, opacity: 0 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeOut"
                    }}
                />
            ))}

            <div className="relative z-20 w-16 h-16 bg-white rounded-full shadow-xl shadow-gray-200 border border-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-brand-900" />
                </div>
            </div>

            {[
                { icon: Twitter, color: "#0EA5E9", angle: 0, dist: 90 },
                { icon: Facebook, color: "#2563EB", angle: 60, dist: 90 },
                { icon: Linkedin, color: "#0A66C2", angle: 120, dist: 90 },
                { icon: MessageCircle, color: "#10B981", angle: 180, dist: 90 },
                { icon: Copy, color: "#6B7280", angle: 240, dist: 90 },
                { icon: Share2, color: "#8B5CF6", angle: 300, dist: 90 },
            ].map((item, i) => {
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * item.dist;
                const y = Math.sin(rad) * item.dist;
                const delays = [0, 0.4, 0.1, 0.5, 0.2, 0.6];

                return (
                    <motion.div
                        key={i}
                        className="absolute z-10 w-10 h-10 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center justify-center"
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                        animate={{
                            x: [0, x, x, 0],
                            y: [0, y, y, 0],
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1, 1, 0.5]
                        }}
                        transition={{
                            duration: 3,
                            times: [0, 0.15, 0.6, 0.75],
                            repeat: Infinity,
                            delay: delays[i],
                            ease: "easeInOut"
                        }}
                    >
                        <item.icon size={18} style={{ color: item.color }} />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ShareGraphic;
