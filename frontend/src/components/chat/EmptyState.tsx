'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface EmptyStateProps {
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ className }) => {
  const examplePrompts = [
    "Add a task to buy groceries",
    "Show me my pending tasks",
    "Mark task 3 as complete",
    "What have I completed today?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }} // Gentle fade + upward motion
      className={cn(
        'flex flex-col items-center justify-center h-full p-8 text-center',
        'text-text-secondary',
        className
      )}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Welcome to Todo AI Chatbot</h2>
        <p className="text-text-secondary max-w-md">
          I'm here to help you manage your tasks. Just type your request naturally, and I'll take care of the rest.
        </p>
      </div>

      <div className="space-y-3 w-full max-w-md">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
          Try these examples:
        </h3>
        {examplePrompts.map((prompt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 // Staggered entrance animation
            }}
            className="bg-surface p-4 rounded-lg border border-border hover:bg-surface-light transition-colors cursor-pointer"
          >
            <p className="text-text-primary">{prompt}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;