import { useEffect, useRef } from 'react';

export const useScrollToBottom = (dependency: any) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollTop = elementRef.current.scrollHeight;
    }
  }, [dependency]);

  return elementRef;
};