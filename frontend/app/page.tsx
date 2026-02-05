'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatContainer from '@/components/ChatContainer';
import EmptyState from '@/components/EmptyState';
import { authClient } from '@/lib/auth';

export default function ChatPage() {
  const router = useRouter();
  const [hasMessages, setHasMessages] = useState(false);
  const { data: session, isPending, error } = authClient.useSession();
  const isAuthenticated = !!session;

  // In a real implementation, this would be set based on actual message data
  // For now, we'll show EmptyState when there are no messages
  useEffect(() => {
    // This would typically come from props or state that tracks if there are messages
    // For now, we'll simulate the initial state
    setHasMessages(false);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && (!isAuthenticated || error)) {
      router.push('/login');
    }
  }, [isAuthenticated, error, isPending, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return null; // Redirect happens in effect above
  }

  return (
    <ChatContainer initialConversationId={null} />
  );
}