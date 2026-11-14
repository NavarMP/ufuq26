'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useApp } from '@/context/AppContext';

interface Waypoint {
  id: string;
  num: string;
  labelKey: string;
  defaultLabel: string;
}

const WAYPOINTS: Waypoint[] = [
  { id: 'home', num: '01', labelKey: 'nav.home', defaultLabel: 'Home' },
  { id: 'about', num: '02', labelKey: 'nav.about', defaultLabel: 'About' },
  { id: 'schedule', num: '03', labelKey: 'nav.schedule', defaultLabel: 'Schedule' },
  { id: 'guests', num: '04', labelKey: 'nav.guests', defaultLabel: 'Guests' },
  { id: 'location', num: '05', labelKey: 'nav.contact', defaultLabel: 'Location' },
  { id: 'register', num: '06', labelKey: 'nav.register', defaultLabel: 'Register' },
  { id: 'faq', num: '07', labelKey: 'nav.faq', defaultLabel: 'FAQ' },
];

const TRACK_PADDING = 16; // 1rem padding top & bottom

export default function CustomScrollbar() {
  const pathname = usePathname();
  const { lenis, scrollTo } = useSmoothScroll();
  const { t, isRtl } = useApp();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [hoveredWaypoint, setHoveredWaypoint] = useState<Waypoint | null>(null);
  const [trackHeight, setTrackHeight] = useState(500);

  const trackRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if device uses fine pointer (mouse/trackpad)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update track height measurement on resize
  useEffect(() => {
    const updateHeight = () => {
      if (trackRef.current) {
        setTrackHeight(trackRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight, { passive: true });
    return () => window.removeEventListener('resize', updateHeight);
  }, [pathname]);

  // Wake up HUD on activity, then fade to ambient idle after 2.5s
  const triggerActivity = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 2500);
  }, []);

  // Detect active section using getBoundingClientRect
  const detectActiveSection = useCallback(() => {
    const viewportThreshold = window.innerHeight * 0.45;
    for (let i = WAYPOINTS.length - 1; i >= 0; i--) {
      const el = document.getElementById(WAYPOINTS[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportThreshold) {
          setActiveSection(WAYPOINTS[i].id);
          return;
        }
      }
    }
    setActiveSection('home');
  }, []);

  // Scroll listener for progress and section detection
  useEffect(() => {
    // Only run on home page
    if (pathname !== '/') return;

    const handleScroll = () => {
      triggerActivity();
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset;
      const progress = docHeight > 0 ? Math.min(Math.max(currentScroll / docHeight, 0), 1) : 0;
      setScrollProgress(progress);
      detectActiveSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', triggerActivity, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', triggerActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [pathname, triggerActivity, detectActiveSection]);

  // Direct thumb drag with immediate response and no rubber-banding
  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    // Prevent text selection & glitching during active drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const usableHeight = rect.height - TRACK_PADDING * 2;
      const relativeY = moveEvent.clientY - rect.top - TRACK_PADDING;
      const percentage = Math.min(Math.max(relativeY / usableHeight, 0), 1);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = percentage * docHeight;

      if (lenis) {
        lenis.scrollTo(targetScroll, { immediate: true });
      } else {
        window.scrollTo({ top: targetScroll });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Jump to click coordinate on track
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const usableHeight = rect.height - TRACK_PADDING * 2;
    const clickY = e.clientY - rect.top - TRACK_PADDING;
    const percentage = Math.min(Math.max(clickY / usableHeight, 0), 1);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = percentage * docHeight;

    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.9 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // ROUTE ISOLATION: Only render custom scrollbar HUD on landing page
  if (!isFinePointer || pathname !== '/') return null;

  const activeWaypoint = WAYPOINTS.find((wp) => wp.id === activeSection) || WAYPOINTS[0];
  const percentText = `${Math.round(scrollProgress * 100)}%`;

  // Exact pixel calculation of thumb position along hairline track
  const thumbHeight = isDragging ? 44 : isHovered ? 36 : 28;
  const usableTravel = Math.max(trackHeight - TRACK_PADDING * 2 - thumbHeight, 0);
  const thumbTop = TRACK_PADDING + scrollProgress * usableTravel;

  return (
    <>
      {/* TOP AMBIENT LASER READING PROGRESS LINE */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-teal shadow-[0_0_8px_rgba(201,164,92,0.6)] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ARTCRAFT-STYLE FLOATING RIGHT-RAIL SCROLL HUD */}
      <aside
        role="navigation"
        aria-label="Interactive Page Scrollbar"
        className={`fixed top-0 bottom-0 ${
          isRtl ? 'left-2.5' : 'right-2.5'
        } z-40 flex items-center justify-center pointer-events-none select-none transition-opacity duration-500 ${
          isIdle && !isHovered && !isDragging ? 'opacity-25' : 'opacity-100'
        }`}
      >
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredWaypoint(null);
          }}
          className={`relative h-[68vh] w-9 flex items-center justify-center cursor-pointer pointer-events-auto rounded-full transition-all duration-300 ${
            isHovered || isDragging
              ? 'bg-black/15 dark:bg-white/10 backdrop-blur-md shadow-2xl border border-brand-gold/30'
              : 'bg-transparent'
          }`}
        >
          {/* Hairline Track Line */}
          <div className="absolute top-4 bottom-4 w-[2px] rounded-full bg-neutral-400/25 dark:bg-white/15 transition-colors group-hover:bg-brand-gold/40" />

          {/* Section Waypoint Pips */}
          <div className="absolute top-4 bottom-4 inset-x-0 flex flex-col justify-between items-center py-1 pointer-events-none">
            {WAYPOINTS.map((wp) => {
              const isActive = activeSection === wp.id;
              return (
                <div
                  key={wp.id}
                  onMouseEnter={() => setHoveredWaypoint(wp)}
                  onMouseLeave={() => setHoveredWaypoint(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollTo(`#${wp.id}`);
                  }}
                  className="pointer-events-auto group/pip relative flex items-center justify-center w-6 h-4 cursor-pointer"
                  title={`${wp.num} • ${t(wp.labelKey) || wp.defaultLabel}`}
                >
                  <span
                    className={`rounded-full transition-all duration-200 ${
                      isActive
                        ? 'w-2 h-2 bg-brand-gold shadow-[0_0_8px_rgba(201,164,92,0.9)] scale-125'
                        : 'w-1 h-1 bg-neutral-400/40 dark:bg-white/30 group-hover/pip:bg-brand-gold group-hover/pip:scale-125'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Draggable Luminous Capsule Thumb (Smooth without Jitter) */}
          <div
            onMouseDown={handleThumbMouseDown}
            style={{
              top: `${thumbTop}px`,
              height: `${thumbHeight}px`,
              transition: isDragging
                ? 'none'
                : 'top 0.08s ease-out, height 0.15s ease-out, box-shadow 0.15s ease-out',
            }}
            className={`absolute w-3.5 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing ${
              isDragging
                ? 'shadow-[0_0_20px_rgba(201,164,92,0.95)] scale-105'
                : isHovered
                ? 'shadow-[0_0_15px_rgba(201,164,92,0.7)]'
                : 'shadow-[0_0_8px_rgba(201,164,92,0.4)]'
            } bg-gradient-to-b from-brand-gold-light via-brand-gold to-brand-gold-hover border border-white/60 dark:border-brand-navy/60`}
          >
            {/* Grip Ribs */}
            <div className="flex flex-col gap-0.5 items-center pointer-events-none">
              <span className="w-1.5 h-[1px] bg-brand-navy/60 dark:bg-brand-navy/80 rounded" />
              <span className="w-1.5 h-[1px] bg-brand-navy/60 dark:bg-brand-navy/80 rounded" />
              <span className="w-1.5 h-[1px] bg-brand-navy/60 dark:bg-brand-navy/80 rounded" />
            </div>
          </div>

          {/* HUD Waypoint / Percentage Floating Badge */}
          {(isHovered || isDragging) && (
            <div
              style={{
                top: `${thumbTop + thumbHeight / 2}px`,
                transition: isDragging ? 'none' : 'top 0.08s ease-out',
              }}
              className={`absolute ${
                isRtl ? 'left-12' : 'right-12'
              } pointer-events-none -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel shadow-2xl border border-brand-gold/40 text-neutral-900 dark:text-neutral-100 whitespace-nowrap animate-fade-in z-50`}
            >
              <span className="font-mono text-[10px] font-bold text-brand-gold">
                {hoveredWaypoint ? hoveredWaypoint.num : activeWaypoint.num}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <span className="font-clash text-xs font-semibold">
                {hoveredWaypoint
                  ? t(hoveredWaypoint.labelKey) || hoveredWaypoint.defaultLabel
                  : t(activeWaypoint.labelKey) || activeWaypoint.defaultLabel}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
              <span className="font-mono text-[10px] font-bold text-brand-teal dark:text-brand-gold-light">
                {percentText}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
