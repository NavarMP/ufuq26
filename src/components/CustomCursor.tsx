'use client';

import React, { useEffect, useState, useRef } from 'react';
import { animate } from 'animejs';
import { usePreferences } from '@/context/PreferencesContext';

export default function CustomCursor() {
  const { preferences } = usePreferences();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'drag'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device has fine pointer (desktop mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!mediaQuery.matches || prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check contextual target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isDrag = target.closest('[data-cursor="drag"], .cursor-grab, .cursor-grabbing');
        if (isDrag) {
          setCursorType('drag');
        } else {
          const isInteractive = target.closest(
            'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'
          );
          setCursorType(isInteractive ? 'pointer' : 'default');
        }
      }
    };

    // Spawn tactile click ripple shockwave via Anime.js
    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.width = '12px';
      ripple.style.height = '12px';
      document.body.appendChild(ripple);

      animate(ripple, {
        scale: [1, 5.5],
        opacity: [0.9, 0],
        duration: 550,
        ease: 'outQuad',
        onComplete: () => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        },
      });
    };

    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Trailing loop for fluid spring inertia
    let animationFrameId: number;
    let currentX = -100;
    let currentY = -100;

    const animateTrailing = () => {
      currentX += (position.x - currentX) * 0.22;
      currentY += (position.y - currentY) * 0.22;
      setTrailing({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animateTrailing);
    };

    animationFrameId = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position.x, position.y, isVisible]);

  if (!isFinePointer || !isVisible || !preferences.customCursor || preferences.motionMode === 'reduced') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Outer Spring Follower Ring / Aura */}
      <div
        className={`fixed top-0 left-0 rounded-full transition-all duration-150 ease-out flex items-center justify-center ${
          cursorType === 'drag'
            ? 'h-10 w-10 -translate-x-5 -translate-y-5 bg-brand-gold/20 border border-brand-gold shadow-[0_0_12px_rgba(201,164,92,0.4)]'
            : cursorType === 'pointer'
            ? 'h-11 w-11 -translate-x-[22px] -translate-y-[22px] bg-brand-gold/15 border border-brand-gold/80 shadow-[0_0_15px_rgba(201,164,92,0.3)]'
            : isClicking
            ? 'h-5 w-5 -translate-x-2.5 -translate-y-2.5 bg-brand-gold/30 border border-brand-gold'
            : 'h-8 w-8 -translate-x-4 -translate-y-4 border border-brand-gold/60'
        }`}
        style={{
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        {cursorType === 'drag' && (
          <span className="text-[10px] text-brand-gold font-bold select-none leading-none">
            ↕
          </span>
        )}
      </div>

      {/* Center Precision Pointer Dot */}
      <div
        className={`fixed top-0 left-0 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(201,164,92,0.8)] transition-all duration-100 ${
          cursorType === 'pointer'
            ? 'h-1 w-1 -translate-x-[2px] -translate-y-[2px] opacity-40 scale-75'
            : cursorType === 'drag'
            ? 'opacity-0'
            : isClicking
            ? 'h-2 w-2 -translate-x-1 -translate-y-1 scale-125'
            : 'h-1.5 w-1.5 -translate-x-[3px] -translate-y-[3px] opacity-100'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
