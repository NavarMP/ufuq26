'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePreferences } from '@/context/PreferencesContext';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  scrollProgress: number;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  scrollProgress: 0,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { preferences } = usePreferences();
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Pause Lenis on portal pages (/admin, /dars) so dashboards and tables scroll natively
  useEffect(() => {
    if (lenisRef.current) {
      if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/dars') ||
        preferences.motionMode === 'reduced' ||
        preferences.smoothScrollInertia === 'native'
      ) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [pathname, preferences.motionMode, preferences.smoothScrollInertia]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      prefersReducedMotion ||
      preferences.motionMode === 'reduced' ||
      preferences.smoothScrollInertia === 'native'
    ) {
      return;
    }

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const duration = preferences.smoothScrollInertia === 'snappy' ? 0.8 : 1.35;

    // Initialize Lenis
    const lenis = new Lenis({
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential decay
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Sync Lenis scroll events with GSAP ScrollTrigger and progress state
    lenis.on('scroll', (e: { progress: number }) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress);
    });

    // Synchronize GSAP ticker with Lenis raf
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Intercept internal anchor link clicks (#section) for smooth Lenis gliding
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const targetEl = document.querySelector(href) as HTMLElement | null;
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, {
              offset: -75,
              duration: 1.2,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [preferences.motionMode, preferences.smoothScrollInertia]);

  const scrollTo = (target: string | number | HTMLElement, offset = -75) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.2 });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{
        lenis: lenisInstance,
        scrollTo,
        scrollProgress,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
