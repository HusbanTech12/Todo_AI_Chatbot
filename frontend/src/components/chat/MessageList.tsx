'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/src/lib/types';
import { useAutoScroll } from '@/src/hooks/useAutoScroll';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const { elementRef, scrollToBottom } = useAutoScroll();

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div
      ref={elementRef}
      className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`}
    >
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={
            message.sender === 'user'
              ? { x: [20, 0], opacity: [0, 1], y: 0 }
              : { x: [-20, 0], opacity: [0, 1], y: 0 }
          }
          transition={{ duration: 0.15 }} // Duration: fast
        >
          <MessageBubble
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            status={message.status}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MessageList;