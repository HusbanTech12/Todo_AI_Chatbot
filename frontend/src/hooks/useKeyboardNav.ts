import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage keyboard navigation for chat interface
 * Implements keyboard controls for accessibility per WCAG guidelines
 */
export const useKeyboardNav = () => {
  const [focusedElementIndex, setFocusedElementIndex] = useState<number>(-1);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

  // Function to register focusable elements
  const registerFocusableElement = useCallback((element: HTMLElement | null) => {
    if (element && !focusableElements.includes(element)) {
      setFocusableElements(prev => [...prev, element]);
    }
  }, [focusableElements]);

  // Function to unregister focusable elements
  const unregisterFocusableElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      setFocusableElements(prev => prev.filter(el => el !== element));
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (focusableElements.length === 0) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setFocusedElementIndex(prev => {
          const newIndex = prev <= 0 ? focusableElements.length - 1 : prev - 1;
          focusableElements[newIndex]?.focus();
          return newIndex;
        });
        break;

      case 'ArrowDown':
        event.preventDefault();
        setFocusedElementIndex(prev => {
          const newIndex = prev >= focusableElements.length - 1 ? 0 : prev + 1;
          focusableElements[newIndex]?.focus();
          return newIndex;
        });
        break;

      case 'Home':
        event.preventDefault();
        setFocusedElementIndex(0);
        focusableElements[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        const lastIndex = focusableElements.length - 1;
        setFocusedElementIndex(lastIndex);
        focusableElements[lastIndex]?.focus();
        break;

      case 'Tab':
        // Allow normal tab behavior but track position
        setTimeout(() => {
          const activeElement = document.activeElement as HTMLElement;
          const index = focusableElements.indexOf(activeElement);
          if (index !== -1) {
            setFocusedElementIndex(index);
          }
        }, 0);
        break;

      default:
        break;
    }
  }, [focusableElements]);

  // Setup and cleanup event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Focus the initially focused element
  useEffect(() => {
    if (focusableElements.length > 0 && focusedElementIndex >= 0) {
      focusableElements[focusedElementIndex]?.focus();
    }
  }, [focusableElements, focusedElementIndex]);

  return {
    focusedElementIndex,
    focusableElements,
    registerFocusableElement,
    unregisterFocusableElement,
    handleKeyDown,
  };
};

/**
 * Custom hook for managing focus in message list
 * Specifically designed for chat interface accessibility
 */
export const useMessageListKeyboardNav = () => {
  const [messageElements, setMessageElements] = useState<HTMLElement[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(-1);

  const registerMessageElement = useCallback((element: HTMLElement | null) => {
    if (element && !messageElements.includes(element)) {
      setMessageElements(prev => [...prev, element]);
    }
  }, [messageElements]);

  const navigateToMessage = useCallback((direction: 'next' | 'previous') => {
    if (messageElements.length === 0) return;

    if (direction === 'next') {
      const nextIndex = currentMessageIndex < messageElements.length - 1
        ? currentMessageIndex + 1
        : 0;
      setCurrentMessageIndex(nextIndex);
      messageElements[nextIndex]?.focus();
    } else {
      const prevIndex = currentMessageIndex > 0
        ? currentMessageIndex - 1
        : messageElements.length - 1;
      setCurrentMessageIndex(prevIndex);
      messageElements[prevIndex]?.focus();
    }
  }, [currentMessageIndex, messageElements]);

  return {
    registerMessageElement,
    navigateToMessage,
    currentMessageIndex,
  };
};