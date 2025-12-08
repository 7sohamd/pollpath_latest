import React, { useState, useEffect } from 'react';
import { Menu, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface NavbarProps {
  onNavigate: (view: 'home' | 'create' | 'explore') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explore', action: () => onNavigate('explore') },
    { name: 'Create', action: () => onNavigate('create') },
    { name: 'Process', action: () => onNavigate('home') }, // Placeholder
    { name: 'Contact', action: () => onNavigate('home') }, // Placeholder
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-transparent py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 rounded-lg bg-brand-900 text-white flex items-center justify-center shadow-lg shadow-brand-900/20">
            <Command size={18} />
          </div>
          <span className="font-sans font-semibold text-lg tracking-tight text-brand-900">
            PollPath
          </span>
        </div>

        {/* Desktop Centered Nav Pills */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <div className={`flex items-center gap-1 p-1 rounded-full border transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/90 border-gray-200/80 shadow-md backdrop-blur-md' 
              : 'bg-gray-100/50 border-gray-200/50 backdrop-blur-sm'
          }`}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-brand-900 hover:bg-white/80 rounded-full transition-all duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button size="sm" onClick={() => onNavigate('create')}>
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-brand-900 bg-white/50 rounded-full backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden absolute top-full left-0 right-0 shadow-2xl"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { link.action(); setMobileMenuOpen(false); }}
                  className="text-left text-base font-medium text-text-secondary hover:text-brand-900 py-2 border-b border-gray-50 last:border-0"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4">
                 <Button className="w-full" onClick={() => { onNavigate('create'); setMobileMenuOpen(false); }}>
                    Get Started
                 </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;