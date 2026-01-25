import { Message } from '../lib/api';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Start a conversation by sending a message...</p>
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