import { useEffect, useRef } from 'react';

/**
 * Hook to automatically scroll to the bottom of a container when content changes
 * Used for auto-scrolling to latest message in chat interface
 */
export const useAutoScroll = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      // Scroll to the bottom smoothly
      elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }
  }, []); // Run once on mount

  // Function to manually trigger scroll to bottom
  const scrollToBottom = () => {
    if (elementRef.current) {
      elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }
  };

  // Function to scroll to bottom with smooth animation
  const scrollToBottomSmooth = () => {
    if (elementRef.current) {
      elementRef.current.scrollTo({
        top: elementRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return {
    elementRef,
    scrollToBottom,
    scrollToBottomSmooth
  };
};