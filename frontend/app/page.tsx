'use client';

import { useState, useEffect } from 'react';
import ChatContainer from '@/components/ChatContainer';

export default function ChatPage() {
  const [initialConversationId, setInitialConversationId] = useState<number | null>(null);

  useEffect(() => {
    // Check for conversation ID in URL query params or from previous session
    const urlParams = new URLSearchParams(window.location.search);
    const convId = urlParams.get('conversation_id');

    if (convId) {
      setInitialConversationId(parseInt(convId, 10));
    } else {
      // Optionally restore from session storage or local storage
      // const storedConvId = sessionStorage.getItem('current_conversation_id');
      // if (storedConvId) {
      //   setInitialConversationId(parseInt(storedConvId, 10));
      // }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800">Todo AI Chatbot</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatContainer initialConversationId={initialConversationId} />
      </main>
    </div>
  );
}