'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface TypingIndicatorProps {
  className?: string;
  dotCount?: number;
  speed?: number;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className = '',
  dotCount = 3,
  speed = 0.6
}) => {
  return (
    <div className={cn(
      'flex items-center space-x-1 py-2 px-4 bg-surface-light rounded-2xl rounded-bl-none',
      'max-w-max',
      className
    )}>
      {[...Array(dotCount)].map((_, index) => (
        <motion.span
          key={index}
          className="block w-2 h-2 bg-text-secondary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            repeatDelay: 0.1,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;