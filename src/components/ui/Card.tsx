import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  isActive?: boolean;
  interactive?: boolean;
}

export function Card({ isActive = false, interactive = false, className = '', children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`bg-elevated border rounded-xl p-5 transition-colors duration-200
        ${isActive ? 'border-l-[3px] border-l-accent-green border-border' : 'border-border'}
        ${interactive ? 'hover:border-border-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
