import { Message } from '../lib/api';
import MessageBubble from './MessageBubble';
import { useScrollToBottom } from '../lib/useScrollToBottom';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const containerRef = useScrollToBottom(messages);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/10">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
          <div className="mb-6 p-3 bg-primary/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to Todo AI Chatbot</h3>
          <p className="text-muted-foreground max-w-md">
            Start a conversation by sending a message. I can help you manage your todos efficiently.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;