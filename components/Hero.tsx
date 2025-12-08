import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Button from './ui/Button';
import PollCarousel from './MockPoll';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden bg-brand-50">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[85%] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
        {/* Progressive Blur at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-brand-50 via-brand-50/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* 2. Main Typography */}
        <div className="space-y-4 mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-3xl font-sans font-medium text-gray-500 tracking-tight"
          >
            Build Your Personal
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-serif tracking-tighter leading-none"
          >
            <span className="inline-block bg-gradient-to-r from-brand-900 via-white to-brand-900 bg-[length:200%_auto] animate-[shine_8s_linear_infinite] bg-clip-text text-transparent">
              Decision Engine
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-6xl md:text-8xl font-serif italic text-gray-400 tracking-tighter leading-none"
          >
            With <span className="inline-block text-brand-900 not-italic">PollPath</span>.
          </motion.h2>
        </div>

        {/* 3. Description (Subtext) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light"
        >
          Build AI super intelligence with PollPath. Let the crowd decide your next move.
        </motion.p>

        {/* 4. CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <Button size="lg" onClick={onGetStarted} className="px-8 py-4 text-lg bg-brand-900 hover:bg-black text-white shadow-xl shadow-gray-900/10 border-0 rounded-xl group">
            Create Poll
            <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* 5. Mock Poll Preview (Carouel) */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        className="mt-20 w-full flex justify-center perspective-1000"
      >
        <div className="transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out w-full max-w-md">
          <PollCarousel />
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;