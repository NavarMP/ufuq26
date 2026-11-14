'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import AboutHero from '@/components/about/AboutHero';
import HeritageSection from '@/components/about/HeritageSection';
import LeadershipSection from '@/components/about/LeadershipSection';
import PillarsSection from '@/components/about/PillarsSection';
import SuhbaPhilosophySection from '@/components/about/SuhbaPhilosophySection';
import InteractiveDarsNetwork from '@/components/about/InteractiveDarsNetwork';
import CampVisionSection from '@/components/about/CampVisionSection';
import DigitalCraftSection from '@/components/about/DigitalCraftSection';
import AboutCTA from '@/components/about/AboutCTA';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import AIAssistant from '@/components/AIAssistant';
import ScrollRevealEffect from '@/components/ScrollRevealEffect';

export default function AboutClientPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />

      <main id="main-content" className="flex-1 focus:outline-none">
        <AboutHero />
        <HeritageSection />
        <LeadershipSection />
        <PillarsSection />
        <SuhbaPhilosophySection />
        <InteractiveDarsNetwork />
        <CampVisionSection />
        <DigitalCraftSection />
        <AboutCTA />
      </main>

      <Footer />

      {/* Global Modals & Assistive Layer */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AIAssistant />
      <ScrollRevealEffect />
    </div>
  );
}
