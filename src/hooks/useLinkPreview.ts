'use client';

import { useState, useRef, useCallback } from 'react';

interface UseLinkPreviewOptions {
  delay?: number; // Intent delay in ms (default 180ms)
}

export function useLinkPreview({ delay = 180 }: UseLinkPreviewOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150); // Small grace period when moving cursor between trigger & card
  }, []);

  const keepOpen = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  }, []);

  return {
    isVisible,
    show,
    hide,
    keepOpen,
  };
}
