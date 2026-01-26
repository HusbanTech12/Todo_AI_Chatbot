interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MessageBubble = ({ role, content, timestamp }: MessageBubbleProps) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] px-5 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none shadow-md'
            : 'bg-secondary text-secondary-foreground rounded-bl-none shadow-sm'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        <div
          className={`text-xs mt-2 opacity-70 ${
            isUser ? 'text-primary-foreground/80' : 'text-secondary-foreground/80'
          }`}
        >
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;