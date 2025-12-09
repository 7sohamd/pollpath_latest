import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { POLL_DATA } from '../constants/mockPollData';
import PollCard from './MockPoll/PollCard';

const PollCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % POLL_DATA.length);
    }, 4000); // Rotate every 4 seconds
    return () => clearInterval(timer);
  }, [isHovered]);

  const getPosition = (i: number) => {
    const len = POLL_DATA.length;
    // Calculate offset: 0 (active), 1 (next), len-1 (prev)
    const offset = (i - index + len) % len;

    if (offset === 0) return 'center';
    if (offset === 1) return 'right';
    return 'left';
  };

  const variants = {
    center: {
      x: '0%',
      scale: 1,
      zIndex: 20,
      opacity: 1,
      filter: 'blur(0px) brightness(1)'
    },
    left: {
      x: '-65%',
      scale: 0.8,
      zIndex: 10,
      opacity: 0.5,
      filter: 'blur(2px) brightness(0.95)'
    },
    right: {
      x: '65%',
      scale: 0.8,
      zIndex: 10,
      opacity: 0.5,
      filter: 'blur(2px) brightness(0.95)'
    }
  };

  return (
    <div
      className="relative w-full max-w-sm mx-auto h-[380px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[120%] bg-gray-200/40 blur-[80px] rounded-full -z-10" />

      {/* Cards Container */}
      <div className="relative w-full h-full perspective-1000">
        {POLL_DATA.map((poll, i) => {
          const position = getPosition(i);
          return (
            <motion.div
              key={poll.id}
              className="absolute top-0 left-0 w-full h-full origin-center will-change-transform"
              animate={position}
              variants={variants}
              transition={{
                duration: 0.7,
                type: "spring",
                stiffness: 180,
                damping: 25
              }}
              style={{
                cursor: position === 'center' ? 'auto' : 'pointer'
              }}
              onClick={() => {
                if (position !== 'center') setIndex(i);
              }}
            >
              {/* Interaction blocker for side cards */}
              {position !== 'center' && (
                <div className="absolute inset-0 z-50 rounded-3xl" />
              )}
              <PollCard data={poll} />
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {POLL_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-gray-800' : 'w-1.5 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PollCarousel;