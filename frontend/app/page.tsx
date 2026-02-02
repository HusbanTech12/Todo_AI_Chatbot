'use client';

import { useState, useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';
import AuthButton from '@/components/AuthButton';
import { ThemeSelector } from '@/components/ThemeSelector';

export default function ChatPage() {
  const [initialConversationId, setInitialConversationId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Check for conversation ID in URL query params or from previous session
    const urlParams = new URLSearchParams(window.location.search);
    const convId = urlParams.get('conversation_id');

    if (convId) {
      const parsedId = parseInt(convId, 10);
      if (!isNaN(parsedId)) {
        setInitialConversationId(parsedId);
      }
    } else {
      // Optionally restore from session storage or local storage
      // const storedConvId = sessionStorage.getItem('current_conversation_id');
      // if (storedConvId) {
      //   const parsedStoredId = parseInt(storedConvId, 10);
      //   if (!isNaN(parsedStoredId)) {
      //     setInitialConversationId(parsedStoredId);
      //   }
      // }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card border-b border-border p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Todo AI Chatbot</h1>
          <div className="flex items-center space-x-4">
            <ThemeSelector />
            <AuthButton />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden bg-background">
        <ChatContainer initialConversationId={initialConversationId} />
      </main>
    </div>
  );
}