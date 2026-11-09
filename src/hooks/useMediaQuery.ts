'use client';

import { useState, useEffect } from 'react';

/**
 * SSR-safe custom hook for media queries and pointer capability detection.
 * Supports standard responsive breakpoints and touch/pointer fine detection.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern API with legacy fallback
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Convenient responsive & pointer capabilities hook
 */
export function useResponsive() {
  const isDesktop = useMediaQuery('(min-width: 768px)', true);
  const isLargeDesktop = useMediaQuery('(min-width: 1024px)', true);
  const isSmallMobile = useMediaQuery('(max-width: 374px)', false);
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)', true);
  const isCoarseTouch = useMediaQuery('(hover: none) and (pointer: coarse)', false);

  const isMobile = !isDesktop;
  // Consider touch if either screen is mobile OR pointer is coarse
  const isTouchDevice = isMobile || isCoarseTouch || !hasFinePointer;

  return {
    isDesktop,
    isLargeDesktop,
    isMobile,
    isSmallMobile,
    hasFinePointer,
    isTouchDevice,
  };
}
