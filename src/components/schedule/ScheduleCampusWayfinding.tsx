'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { CAMP_VENUES } from '@/lib/scheduleData';
import { resolveLocalized } from '@/lib/translations';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  MapPin,
  Building,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function ScheduleCampusWayfinding() {
  const { language, isRtl } = useApp();
  const { selectedVenue, setSelectedVenue, setActiveView } = useScheduleStore();
  const { triggerLight } = useHapticFeedback();

  const handleSelectVenue = (venueId: string) => {
    triggerLight();
    soundEngine.playClick();
    setSelectedVenue(venueId === selectedVenue ? 'all' : venueId);
    setActiveView('timeline');
    // Smooth scroll up to timeline
    const controlDeckEl = document.getElementById('schedule-controls');
    if (controlDeckEl) {
      controlDeckEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Campus Venues & Wayfinding"
      className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/40 shadow-2xl space-y-8 my-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/15 text-brand-teal dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Campus Geography & Venues</span>
          </div>
          <h3 className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-navy dark:text-white">
            Alathurpadi Dars Campus Wayfinding
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
            All sessions are hosted across five dedicated academic and spiritual zones on the historic campus grounds. Click any venue to filter the timeline.
          </p>
        </div>

        {selectedVenue !== 'all' && (
          <button
            onClick={() => setSelectedVenue('all')}
            className="text-xs font-semibold text-rose-500 hover:underline shrink-0"
          >
            Clear Venue Filter
          </button>
        )}
      </div>

      {/* Venues Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAMP_VENUES.map((venue) => {
          const isSelected = selectedVenue === venue.id;
          const venueName = resolveLocalized(venue.name, language);

          return (
            <div
              key={venue.id}
              onClick={() => handleSelectVenue(venue.id)}
              className={`group rounded-2xl glass-panel p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-brand-gold bg-brand-gold/15 shadow-xl scale-[1.02]'
                  : 'border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                    {venue.building}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-gold">
                    <Users className="w-3 h-3" />
                    <span>Cap: {venue.capacity}</span>
                  </div>
                </div>

                <h4 className="font-clash text-base font-bold text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors leading-snug">
                  {venueName}
                </h4>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Location: <strong className="text-neutral-700 dark:text-neutral-300">{venue.floor}</strong>
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {venue.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-neutral-200/40 dark:border-white/5 text-neutral-600 dark:text-neutral-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200/50 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-brand-gold">
                <span>{isSelected ? 'Currently Filtered' : 'Filter Sessions Here'}</span>
                <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
