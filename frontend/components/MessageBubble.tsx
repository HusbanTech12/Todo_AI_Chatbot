interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MessageBubble = ({ role, content, timestamp }: MessageBubbleProps) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-200' : 'text-gray-500'
          }`}
        >
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;