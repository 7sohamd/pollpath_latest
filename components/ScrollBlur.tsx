
import React, { useEffect, useState } from 'react';

const ScrollBlur: React.FC = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      
      // Start fading out when within 300px of the bottom
      const fadeThreshold = 300;
      
      if (distanceToBottom < fadeThreshold) {
        // Calculate opacity: 0 at bottom, 1 at threshold
        const newOpacity = Math.max(0, distanceToBottom / fadeThreshold);
        setOpacity(newOpacity);
      } else {
        setOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-40 transition-opacity duration-300"
      style={{ 
        opacity,
        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%)' 
      }}
    />
  );
};

export default ScrollBlur;
