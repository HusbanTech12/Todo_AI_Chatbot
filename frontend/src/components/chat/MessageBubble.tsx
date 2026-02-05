'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { formatDate } from '@/src/lib/utils';
import { MessageStatus } from '@/src/lib/types';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  status?: MessageStatus;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  timestamp,
  status = 'sent',
  className
}) => {
  const isUser = sender === 'user';
  const isSystem = sender === 'system';

  // Determine styling based on sender
  const bubbleClasses = cn(
    'max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-text-primary relative group',
    isUser
      ? 'self-end bg-accent-ai ml-auto rounded-br-none' // Right aligned for user, distinct styling
      : isSystem
        ? 'self-center bg-surface-light mx-auto text-center border border-border rounded-xl' // Centered for system, subtle
        : 'self-start bg-surface-light mr-auto rounded-bl-none', // Left aligned for assistant, distinct styling
    status === 'error' ? 'bg-error/20 border border-error' : '',
    className
  );

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <motion.div
        className={bubbleClasses}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }} // Duration: fast
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
        </div>

        <div className={cn(
          'text-xs mt-1 opacity-70',
          isSystem ? 'text-center' : isUser ? 'text-right' : 'text-left'
        )}>
          {formatDate(timestamp)}
          {status === 'pending' && <span className="ml-1">...</span>}
          {status === 'error' && <span className="ml-1 text-error">(failed)</span>}
        </div>
      </motion.div>
    </div>
  );
};

export default MessageBubble;