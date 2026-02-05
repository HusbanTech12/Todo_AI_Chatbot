'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, AlertTriangleIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ErrorBannerProps {
  message: string;
  isVisible?: boolean;
  onDismiss?: () => void;
  showDismissButton?: boolean;
  duration?: number;
  className?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  isVisible = true,
  onDismiss,
  showDismissButton = true,
  duration,
  className
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  // Auto-hide after duration if specified
  useEffect(() => {
    if (duration && show) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, show]);

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-auto mt-4',
          'flex items-center justify-between gap-4 p-4 bg-error/20 text-error rounded-lg border border-error/30 shadow-lg',
          'text-sm',
          className
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          <AlertTriangleIcon size={16} className="flex-shrink-0" />
          <span className="truncate">{message}</span>
        </div>

        {showDismissButton && (
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-error/20 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Dismiss error"
          >
            <XIcon size={16} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorBanner;