
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-xl tracking-wide";
  
  const variants = {
    // Solid Black
    primary: "bg-brand-900 text-white hover:bg-black shadow-lg shadow-black/5 hover:shadow-black/10 border border-transparent",
    // White with subtle border
    secondary: "bg-white border border-gray-200 text-brand-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    // Ghost
    ghost: "bg-transparent hover:bg-gray-100 text-text-secondary hover:text-brand-900",
    // Glass
    glass: "bg-white/40 backdrop-blur-md border border-white/50 text-brand-900 hover:bg-white/60"
  };

  const sizes = {
    sm: "text-xs px-4 py-2 gap-1.5",
    md: "text-sm px-6 py-2.5 gap-2",
    lg: "text-base px-8 py-3.5 gap-2.5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </motion.button>
  );
};

export default Button;
