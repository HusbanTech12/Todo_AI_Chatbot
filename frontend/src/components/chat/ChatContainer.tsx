'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { Message } from '@/src/lib/types';
import { sendMessage } from '@/src/services/api';

interface ChatContainerProps {
  children?: React.ReactNode;
  className?: string;
  userId?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children, className, userId = 'user' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create a new user message with pending status
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'pending'
    };

    // Add the pending message to the list
    setMessages(prev => [...prev, userMessage]);

    try {
      setIsLoading(true);

      // Send the message to the API
      const response = await sendMessage({
        userId,
        message: content,
        conversationId: messages.length > 0 ? messages[0].id : undefined
      });

      // Update the user message status to sent
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );

      // Add the AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.response,
        sender: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Update the user message status to error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.98 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }} // Soft scale-in (0.98 → 1.0) on mount, Duration: normal
      className={cn(
        'w-full max-w-chat mx-auto bg-surface-light rounded-lg shadow-lg overflow-hidden flex flex-col',
        'h-[calc(100vh-4rem)] max-h-[700px]', // Full height minus padding
        className
      )}
    >
      {messages.length > 0 ? (
        <>
          <MessageList messages={messages} />
          {isLoading && (
            <div className="px-4 pb-2">
              <TypingIndicator />
            </div>
          )}
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </>
      ) : (
        // Show children if no messages exist (like EmptyState)
        children
      )}
    </motion.div>
  );
};

export default ChatContainer;