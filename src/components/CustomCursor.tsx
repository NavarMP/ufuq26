'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePreferences } from '@/context/PreferencesContext';

export default function CustomCursor() {
  const { preferences } = usePreferences();
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'drag'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const isInitialMove = useRef(true);

  // Detect fine pointer (mouse / trackpad) vs touch device
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    try {
      mediaQuery.addEventListener('change', onMediaChange);
    } catch {
      mediaQuery.addListener(onMediaChange);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', onMediaChange);
      } catch {
        mediaQuery.removeListener(onMediaChange);
      }
    };
  }, []);

  // Main cursor animation & event handling
  useEffect(() => {
    if (!isFinePointer || !preferences.customCursor || preferences.motionMode === 'reduced') {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // On first movement, snap follower directly so it doesn't fly across screen
      if (isInitialMove.current) {
        currentPos.current = { x: clientX, y: clientY };
        isInitialMove.current = false;
      }

      mousePos.current = { x: clientX, y: clientY };
      setIsVisible(true);

      // Instantly position precision center dot with zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check contextual target under cursor
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

    // Tactile click ripple shockwave
    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.width = '12px';
      ripple.style.height = '12px';
      document.body.appendChild(ripple);

      try {
        const anim = ripple.animate(
          [
            { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.85' },
            { transform: 'translate(-50%, -50%) scale(5.5)', opacity: '0' },
          ],
          {
            duration: 500,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'forwards',
          }
        );
        anim.onfinish = () => ripple.remove();
      } catch {
        setTimeout(() => ripple.remove(), 550);
      }
    };

    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth inertia trailing loop for fluid follower ring
    const animateTrailing = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.2;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animateTrailing);
    };

    rafId = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isFinePointer, preferences.customCursor, preferences.motionMode]);

  if (!isFinePointer || !preferences.customCursor || preferences.motionMode === 'reduced') {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Outer Spring Follower Ring / Aura */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center pointer-events-none transition-[width,height,background-color,border-color,box-shadow,opacity] duration-200 ease-out ${
          cursorType === 'drag'
            ? 'h-10 w-10 bg-brand-gold/20 border border-brand-gold shadow-[0_0_12px_rgba(201,164,92,0.4)]'
            : cursorType === 'pointer'
            ? 'h-11 w-11 bg-brand-gold/15 border border-brand-gold/80 shadow-[0_0_15px_rgba(201,164,92,0.3)]'
            : isClicking
            ? 'h-6 w-6 bg-brand-gold/30 border border-brand-gold shadow-[0_0_8px_rgba(201,164,92,0.5)]'
            : 'h-8 w-8 bg-transparent border border-brand-gold/60'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
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
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full bg-brand-gold shadow-[0_0_6px_rgba(201,164,92,0.8)] pointer-events-none transition-[width,height,opacity] duration-150 ease-out ${
          cursorType === 'pointer'
            ? 'h-1 w-1 opacity-50'
            : cursorType === 'drag'
            ? 'opacity-0'
            : isClicking
            ? 'h-2.5 w-2.5 opacity-90'
            : 'h-1.5 w-1.5 opacity-100'
        }`}
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
