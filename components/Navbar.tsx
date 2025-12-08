import React, { useState, useEffect } from 'react';
import { Menu, X, Command, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onNavigate: (view: 'home' | 'create' | 'explore') => void;
  isSticky?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, isSticky = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // First navigate to home page if needed
    onNavigate('home');

    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navLinks = [
    { name: 'Explore', action: () => onNavigate('explore') },
    { name: 'Create', action: () => onNavigate('create') },
    { name: 'Process', action: () => scrollToSection('features') },
    { name: 'Contact', action: () => scrollToSection('contact') },
  ];

  return (
    <nav
      className={`${isSticky ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
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
        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <div className={`flex items-center gap-1 p-1 rounded-full border transition-all duration-300 ${isScrolled
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
        <div className="hidden md:flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => scrollToSection('pricing')}
          >
            Go Pro
          </Button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-semibold">
                  {user.email?.[0].toUpperCase()}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { signOut(); setShowUserMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              Sign In
            </Button>
          )}
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
              <div className="pt-4 space-y-3">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => { scrollToSection('pricing'); setMobileMenuOpen(false); }}
                >
                  Go Pro
                </Button>

                {user ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}>
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;