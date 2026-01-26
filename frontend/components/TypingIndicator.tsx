interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator = ({ isVisible }: TypingIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[85%] md:max-w-[75%] px-5 py-3 rounded-2xl bg-secondary text-secondary-foreground rounded-bl-none shadow-sm">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;