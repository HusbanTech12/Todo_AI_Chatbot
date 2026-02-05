'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { SendHorizontalIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      resizeTextarea();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow Shift+Enter for newlines (per FR-012)
      setInputValue(prev => prev + '\n');
    }
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  React.useEffect(() => {
    resizeTextarea();
  }, [inputValue]);

  return (
    <div className={cn(
      'p-4 border-t border-border bg-surface',
      'flex items-end gap-2',
      className
    )}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full resize-none py-3 px-4 bg-background border border-border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-accent-ai focus:border-transparent',
            'text-text-primary placeholder:text-text-secondary',
            'min-h-[56px] max-h-[150px]',
            'transition-all duration-200',
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          )}
        />
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={disabled || !inputValue.trim()}
        className={cn(
          'h-[56px] w-[56px] flex items-center justify-center rounded-lg',
          'bg-accent-ai text-white hover:bg-accent-ai/90',
          'focus:outline-none focus:ring-2 focus:ring-accent-ai focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
      >
        <SendHorizontalIcon size={20} />
      </motion.button>
    </div>
  );
};

export default ChatInput;