'use client';

import { useState, useEffect } from 'react';
import { ChatSession, Message, sendChatMessage, handleApiError } from '../lib/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ErrorBanner from './ErrorBanner';

interface ChatContainerProps {
  initialConversationId?: number;
}

const ChatContainer = ({ initialConversationId }: ChatContainerProps) => {
  const [chatSession, setChatSession] = useState<ChatSession>({
    conversation_id: initialConversationId || null,
    messages: [],
    isLoading: false,
    error: null,
  });

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (initialConversationId) {
      // Load existing conversation if provided
      loadConversationHistory(initialConversationId);
    }
  }, [initialConversationId]);

  const loadConversationHistory = async (conversationId: number) => {
    setChatSession(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll just set the conversation ID and clear any error
      setChatSession(prev => ({
        ...prev,
        conversation_id: conversationId,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setChatSession(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || chatSession.isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setChatSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await sendChatMessage('current-user-id', {
        conversation_id: chatSession.conversation_id,
        message: inputValue,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setChatSession(prev => ({
        conversation_id: response.conversation_id,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        error: null,
      }));

      setInputValue('');
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setChatSession(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {chatSession.error && <ErrorBanner message={chatSession.error} />}
      <MessageList messages={chatSession.messages} />
      <ChatInput
        value={inputValue}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        isLoading={chatSession.isLoading}
      />
    </div>
  );
};

export default ChatContainer;