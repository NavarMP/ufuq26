'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import ShareModal from '@/components/share/ShareModal';
import AIAssistant from '@/components/AIAssistant';
import ScrollRevealEffect from '@/components/ScrollRevealEffect';

import ScheduleHero from '@/components/schedule/ScheduleHero';
import ScheduleControlDeck from '@/components/schedule/ScheduleControlDeck';
import ScheduleTimelineView from '@/components/schedule/ScheduleTimelineView';
import ScheduleWeekMatrixView from '@/components/schedule/ScheduleWeekMatrixView';
import ScheduleMonthCalendarView from '@/components/schedule/ScheduleMonthCalendarView';
import ScheduleMyItineraryView from '@/components/schedule/ScheduleMyItineraryView';
import ScheduleCampusWayfinding from '@/components/schedule/ScheduleCampusWayfinding';
import ScheduleExportBar from '@/components/schedule/ScheduleExportBar';
import ScheduleSessionDetailModal from '@/components/schedule/ScheduleSessionDetailModal';

import { useScheduleStore } from '@/store/scheduleStore';
import { EnhancedScheduleSession } from '@/types/schedule';
import { EXTENDED_SCHEDULE_SESSIONS } from '@/lib/scheduleData';

function ScheduleContent() {
  const searchParams = useSearchParams();
  const { activeView, setSelectedDay, setSelectedTrack } = useScheduleStore();
  const [inspectedSession, setInspectedSession] = useState<EnhancedScheduleSession | null>(null);

  // Sync URL search params on mount
  useEffect(() => {
    if (!searchParams) return;

    const dayParam = searchParams.get('day');
    if (dayParam) {
      const dayNum = parseInt(dayParam, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 7) {
        setSelectedDay(dayNum);
      }
    }

    const trackParam = searchParams.get('track');
    if (trackParam) {
      setSelectedTrack(trackParam);
    }

    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      const match = EXTENDED_SCHEDULE_SESSIONS.find((s) => s.id === sessionParam);
      if (match) {
        setInspectedSession(match);
      }
    }
  }, [searchParams, setSelectedDay, setSelectedTrack]);

  return (
    <>
      <ScheduleHero />

      <div id="schedule-controls">
        <ScheduleControlDeck />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Dynamic View Switcher */}
        {activeView === 'timeline' && (
          <ScheduleTimelineView onInspectSession={(s) => setInspectedSession(s)} />
        )}

        {activeView === 'matrix' && (
          <ScheduleWeekMatrixView onInspectSession={(s) => setInspectedSession(s)} />
        )}

        {activeView === 'calendar' && (
          <ScheduleMonthCalendarView onInspectSession={(s) => setInspectedSession(s)} />
        )}

        {activeView === 'itinerary' && (
          <ScheduleMyItineraryView onInspectSession={(s) => setInspectedSession(s)} />
        )}

        {/* Campus Wayfinding & Hall Locator */}
        <ScheduleCampusWayfinding />

        {/* Universal Export & Print Hub */}
        <ScheduleExportBar />
      </div>

      {/* Inspect Session Deep-Dive Modal */}
      <ScheduleSessionDetailModal
        session={inspectedSession}
        onClose={() => setInspectedSession(null)}
      />
    </>
  );
}

export default function SchedulePage() {
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
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
            </div>
          }
        >
          <ScheduleContent />
        </Suspense>
      </main>

      <Footer />

      {/* Global Assistive Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ShareModal />
      <AIAssistant />
      <ScrollRevealEffect />
    </div>
  );
}
