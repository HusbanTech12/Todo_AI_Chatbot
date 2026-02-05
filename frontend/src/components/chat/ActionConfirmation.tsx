'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ActionConfirmationProps {
  message: string;
  isVisible?: boolean;
  duration?: number;
  className?: string;
}

const ActionConfirmation: React.FC<ActionConfirmationProps> = ({
  message,
  isVisible = true,
  duration = 3000, // Auto-dismiss after 3 seconds
  className
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            duration: 0.2 // Success checkmark draw
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-lg border border-success/30',
            'text-sm',
            className
          )}
        >
          <CheckCircleIcon size={16} className="flex-shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActionConfirmation;