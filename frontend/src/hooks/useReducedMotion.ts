import { useState, useEffect } from 'react';

/**
 * Hook to detect if user has requested reduced motion
 * Respects the `prefers-reduced-motion` system preference per accessibility constraints
 */
export const useReducedMotion = (): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      // Server-side rendering: default to no reduced motion
      setMatches(false);
      return;
    }

    const mediaQuery = '(prefers-reduced-motion: reduce)';
    const mediaQueryList = window.matchMedia(mediaQuery);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup listener
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, []);

  return matches;
};