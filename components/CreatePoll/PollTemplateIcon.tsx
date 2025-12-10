import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Plane, Globe,
    LayoutTemplate, MousePointer, Check,
    Utensils, Pizza, Coffee, Sandwich,
    PartyPopper, Music, Sparkles
} from 'lucide-react';

interface PollTemplateIconProps {
    templateName: string;
}

const PollTemplateIcon: React.FC<PollTemplateIconProps> = ({ templateName }) => {
    const thinStroke = 1.5;

    switch (templateName) {
        case "City Move":
            return (
                <div className="relative w-40 h-40 flex items-center justify-center overflow-hidden">
                    {/* Rotating Globe */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="text-brand-100"
                    >
                        <Globe size={110} strokeWidth={1} />
                    </motion.div>

                    {/* Orbiting Plane */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <motion.div
                            className="absolute top-2 left-1/2 -translate-x-1/2 text-brand-600"
                            style={{ rotate: 90 }}
                        >
                            <Plane size={32} strokeWidth={thinStroke} />
                        </motion.div>
                    </motion.div>

                    {/* Central Pin dropping */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <MapPin size={44} className="text-brand-700 drop-shadow-md" strokeWidth={thinStroke} />
                    </motion.div>
                </div>
            );

        case "Logo Feedback":
            return (
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Option A */}
                    <motion.div
                        className="absolute left-4 top-8 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
                        animate={{ x: [0, -10, 0], scale: [1, 0.9, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <LayoutTemplate size={32} className="text-gray-400" strokeWidth={thinStroke} />
                    </motion.div>

                    {/* Option B (Selected) */}
                    <motion.div
                        className="absolute right-4 top-6 bg-white border border-brand-200 rounded-lg p-2 shadow-md z-10"
                        animate={{ x: [0, 10, 0], scale: [1, 1.1, 1], borderColor: ["#e5e7eb", "#8b5cf6", "#e5e7eb"] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <LayoutTemplate size={38} className="text-brand-600" strokeWidth={thinStroke} />
                        <motion.div
                            className="absolute -top-2 -right-2 bg-green-500 rounded-full p-0.5 text-white"
                            animate={{ scale: [0, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
                        >
                            <Check size={12} strokeWidth={3} />
                        </motion.div>
                    </motion.div>

                    {/* Cursor Interaction */}
                    <motion.div
                        className="absolute bottom-2 right-8 text-gray-600"
                        animate={{
                            x: [0, 20, 0],
                            y: [0, -20, 0],
                            scale: [1, 0.8, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <MousePointer size={32} strokeWidth={thinStroke} fill="rgba(0,0,0,0.1)" />
                    </motion.div>
                </div>
            );

        case "Lunch Poll":
            return (
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Central Plate */}
                    <div className="relative z-10 bg-white rounded-full p-3 shadow-sm border border-orange-100">
                        <Utensils size={48} className="text-orange-500" strokeWidth={thinStroke} />
                    </div>

                    {/* Orbiting Food Items */}
                    {[0, 120, 240].map((deg, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0"
                            initial={{ rotate: deg }}
                            animate={{ rotate: deg + 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <motion.div
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                animate={{ rotate: -360 }} // Counter-rotate to keep icon upright
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                {i === 0 && <Pizza size={32} className="text-orange-400" strokeWidth={thinStroke} />}
                                {i === 1 && <Coffee size={32} className="text-brown-400" strokeWidth={thinStroke} />}
                                {i === 2 && <Sandwich size={32} className="text-green-500" strokeWidth={thinStroke} />}
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Pulse Ring */}
                    <motion.div
                        className="absolute inset-0 border border-orange-200 rounded-full"
                        animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            );

        case "Event Theme":
            return (
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Party Popper */}
                    <motion.div
                        animate={{ rotate: [0, -15, 0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 origin-bottom-left"
                    >
                        <PartyPopper size={64} className="text-indigo-600" strokeWidth={thinStroke} />
                    </motion.div>

                    {/* Confetti Particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-2 h-2 rounded-full ${['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400'][i % 4]}`}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                                x: Math.random() * 80 - 10,
                                y: Math.random() * -80 - 10,
                                opacity: [1, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeOut"
                            }}
                            style={{ top: '40%', left: '50%' }}
                        />
                    ))}

                    {/* Music Notes */}
                    <motion.div
                        className="absolute top-2 right-6 text-purple-400"
                        animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                        <Music size={22} strokeWidth={thinStroke} />
                    </motion.div>
                </div>
            );

        default:
            return <MapPin size={48} className="text-gray-400" strokeWidth={thinStroke} />;
    }
};

export default PollTemplateIcon;
