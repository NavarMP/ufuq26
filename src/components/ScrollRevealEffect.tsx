'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollRevealEffect() {
  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Subtle scroll reveal on section headings and cards
    const targets = document.querySelectorAll(
      'section > div, [data-reveal="true"], .reveal-card'
    );

    const triggers: ScrollTrigger[] = [];

    targets.forEach((target) => {
      const el = target as HTMLElement;
      // Skip hero section immediate content so hero is instantly visible
      if (el.closest('#home')) return;

      gsap.set(el, { opacity: 0.88, y: 18 });

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        },
        once: true,
      });

      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return null;
}
