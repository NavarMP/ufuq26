'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ScheduleSection from '@/components/ScheduleSection';
import GuestsSection from '@/components/GuestsSection';
import GallerySection from '@/components/GallerySection';
import LocationSection from '@/components/LocationSection';
import RegistrationSection from '@/components/RegistrationSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import AIAssistant from '@/components/AIAssistant';
import ScrollRevealEffect from '@/components/ScrollRevealEffect';
import ShareModal from '@/components/share/ShareModal';
import { useShare } from '@/hooks/useShare';
import KeyboardShortcutsHud from '@/components/guide/KeyboardShortcutsHud';
import InAppTourModal from '@/components/guide/InAppTourModal';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openShare } = useShare();

  // Listen for custom open-search events & global Shift+S shortcut for Share
  useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift + S to open share modal (when not focused on an input/textarea)
      if (
        (e.key === 'S' || e.key === 's') &&
        (e.shiftKey || e.metaKey) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        openShare({
          title: 'UFUQ ’26 — A Transition & Leadership Camp',
          url: 'https://alathurpadidars.in',
          type: 'event',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-search-modal', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openShare]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />

      <main id="main-content" className="flex-1 focus:outline-none">
        <HeroSection />
        <AboutSection />
        <ScheduleSection />
        <GuestsSection />
        <GallerySection />
        <LocationSection />
        <RegistrationSection />
        <FAQSection />
      </main>

      <Footer />

      {/* Global Modals & Floats */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ShareModal />
      <AIAssistant />
      <ScrollRevealEffect />
      <KeyboardShortcutsHud />
      <InAppTourModal />
    </div>
  );
}
