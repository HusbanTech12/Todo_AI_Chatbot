'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'min-h-screen w-full bg-background flex flex-col items-center justify-start',
      className
    )}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }} // Fade-in on initial load
        className="flex-grow w-full flex flex-col items-center py-8 px-4"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AppShell;