'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ScheduleSection from '@/components/ScheduleSection';
import GuestsSection from '@/components/GuestsSection';
import LocationSection from '@/components/LocationSection';
import RegistrationSection from '@/components/RegistrationSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import AIAssistant from '@/components/AIAssistant';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Listen for custom open-search events
  useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />

      <main id="main-content" className="flex-1 focus:outline-none">
        <HeroSection />
        <AboutSection />
        <ScheduleSection />
        <GuestsSection />
        <LocationSection />
        <RegistrationSection />
        <FAQSection />
      </main>

      <Footer />

      {/* Global Modals & Floats */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AIAssistant />
    </div>
  );
}
