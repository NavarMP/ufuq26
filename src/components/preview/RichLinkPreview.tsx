'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLinkPreview } from '@/hooks/useLinkPreview';

interface RichLinkPreviewProps {
  children: React.ReactNode;
  previewContent: React.ReactNode;
  className?: string;
  placement?: 'top' | 'bottom';
}

export default function RichLinkPreview({
  children,
  previewContent,
  className = '',
  placement = 'top',
}: RichLinkPreviewProps) {
  const { isVisible, show, hide, keepOpen } = useLinkPreview({ delay: 180 });
  const [coords, setCoords] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  // Position calculation with viewport containment
  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = 320; // approximate width of preview card
    const cardHeight = 180;

    // Centered horizontally above/below trigger
    let left = rect.left + rect.width / 2 - cardWidth / 2;

    // Viewport containment: keep at least 16px from edges
    if (left < 16) left = 16;
    if (typeof window !== 'undefined' && left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }

    let top = placement === 'top' ? rect.top - cardHeight - 12 : rect.bottom + 12;
    if (top < 16) {
      top = rect.bottom + 12; // flip to bottom if overflowing top
    }

    setCoords({ left, top });
  }, [isVisible, placement]);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className={`relative inline-block ${className}`}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <div
            onMouseEnter={keepOpen}
            onMouseLeave={hide}
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              zIndex: 9999,
            }}
            className="pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: placement === 'top' ? 8 : -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: placement === 'top' ? 4 : -4 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            >
              {previewContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </span>
  );
}
