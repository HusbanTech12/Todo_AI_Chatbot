interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const ChatInput = ({ value, onChange, onSend, isLoading }: ChatInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-1 border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          disabled={isLoading}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInput;