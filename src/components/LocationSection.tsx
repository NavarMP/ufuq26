'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { MapPin, Navigation, Plane, Train, Bus, ExternalLink, ShieldAlert } from 'lucide-react';

export default function LocationSection() {
  const { eventInfo } = useEvent();
  const { language, isRtl } = useApp();
  const [embedFailed, setEmbedFailed] = useState(false);

  return (
    <section
      id="location"
      aria-label="Camp Venue and Directions"
      className="py-20 md:py-32 px-4 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          Venue & Directions
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          Alathurpadi Dars Campus
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3">
          {resolveLocalized(eventInfo.venue.address, language)}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Map Container */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-2 sm:p-3 border border-brand-gold/30 shadow-2xl overflow-hidden relative min-h-[380px] flex flex-col justify-between">
          {!embedFailed && eventInfo.venue.mapEmbedUrl ? (
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden relative">
              <iframe
                src={eventInfo.venue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Alathurpadi Dars Location Map"
                onError={() => setEmbedFailed(true)}
                className="w-full h-full grayscale-[20%] contrast-[105%]"
              />
            </div>
          ) : (
            /* Fallback Card if embed fails or network is offline */
            <div className="w-full h-80 sm:h-96 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-brand-gold/20 flex flex-col items-center justify-center p-6 text-center">
              <MapPin className="w-12 h-12 text-brand-gold mb-3 animate-bounce" />
              <h3 className="font-clash text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Alathurpadi Dars, Malappuram
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-4">
                Interactive map preview offline or blocked. Tap below to navigate directly using Google Maps.
              </p>
              <a
                href={eventInfo.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold text-brand-navy font-bold text-xs shadow-md hover:bg-brand-gold-hover transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Quick link bar under map */}
          <div className="p-3 flex items-center justify-between text-xs">
            <span className="text-neutral-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              Malappuram, Kerala 676503
            </span>
            <a
              href={eventInfo.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-hover font-semibold"
            >
              <span>Get Directions</span>
              <Navigation className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Travel Information & Connectivity */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl glass-panel border border-brand-gold/25 shadow-lg space-y-4 text-left rtl:text-right">
            <h3 className="font-clash text-lg font-bold text-brand-navy dark:text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-gold" />
              Transit & Travel Guide
            </h3>

            {/* Airport */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
              <Plane className="w-5 h-5 text-brand-teal dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Nearest Airport: Calicut (CCJ)
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Approx. 25 km from Alathurpadi. Direct taxis and KSRTC bus connections available via Kondotty / Malappuram.
                </p>
              </div>
            </div>

            {/* Railway */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
              <Train className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Nearest Railway Stations
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <strong>Tirur (TIR)</strong> (~30 km) and <strong>Kozhikode (CLT)</strong> (~45 km). Both stations have frequent long-distance rail links across India.
                </p>
              </div>
            </div>

            {/* Road / Bus */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
              <Bus className="w-5 h-5 text-brand-teal dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  By Road / Bus
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Well connected from Malappuram Town Bus Stand, Manjeri, and Calicut. Regular auto and bus services reach Alathurpadi directly.
                </p>
              </div>
            </div>

            {/* Reception notice */}
            <div className="pt-2 text-[11px] text-neutral-500 italic border-t border-brand-gold/15">
              An ADSA reception team will coordinate student arrivals on December 24, 2026.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
