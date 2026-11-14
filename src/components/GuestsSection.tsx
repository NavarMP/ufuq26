'use client';

import React from 'react';
import Image from 'next/image';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { UserCheck, Info, User } from 'lucide-react';

export default function GuestsSection() {
  const { guests } = useEvent();
  const { language, t } = useApp();

  const publishedGuests = guests.filter((g) => g.published);

  return (
    <section
      id="guests"
      aria-label="Guests and Speakers"
      className="py-20 md:py-32 px-4 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {t('guests.title')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          {t('guests.subtitle')}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
      </div>

      {/* Sample Content Disclosure */}
      <div className="mb-8 p-4 rounded-2xl glass-panel border border-brand-gold/40 flex items-start sm:items-center gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
        <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5 sm:mt-0" />
        <p>
          <strong className="text-brand-gold">Faculty & Speakers:</strong> {t('guests.sampleLabel')}. Dignitaries, university professors, and guest mentors are being finalized by ADSA.
        </p>
      </div>

      {/* Guests Grid */}
      {publishedGuests.length === 0 ? (
        <div className="text-center py-16 rounded-3xl glass-panel border border-brand-gold/20">
          <User className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-200">
            {t('guests.noGuests')}
          </h3>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedGuests.map((guest) => {
            const isPatron = guest.id === 'guest-1';
            return (
              <div
                key={guest.id}
                className={`rounded-3xl glass-panel p-6 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                  isPatron
                    ? 'border-brand-gold/60 shadow-xl bg-gradient-to-b from-brand-gold/5 via-transparent to-transparent'
                    : 'border-brand-gold/20 hover:border-brand-gold/40 shadow-md'
                }`}
              >
                <div>
                  {/* Photo / Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-brand-gold/30 shrink-0 bg-brand-navy flex items-center justify-center">
                      {guest.photoUrl ? (
                        <Image
                          src={guest.photoUrl}
                          alt={resolveLocalized(guest.name, language)}
                          fill
                          className="object-cover object-top"
                        />
                      ) : (
                        <User className="w-8 h-8 text-brand-gold/60" />
                      )}
                    </div>
                    <div>
                      {isPatron && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold px-2 py-0.5 rounded-full bg-brand-gold/15 mb-1">
                          <UserCheck className="w-3 h-3" /> Spiritual Patron
                        </span>
                      )}
                      <h3 className="font-clash text-lg font-bold text-brand-navy dark:text-white leading-tight">
                        {resolveLocalized(guest.name, language)}
                      </h3>
                      {guest.title && (
                        <p className="text-xs text-brand-teal dark:text-emerald-400 font-medium mt-1 leading-snug">
                          {resolveLocalized(guest.title, language)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {guest.bio && (
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-brand-gold/10 pt-3 mt-2">
                      {resolveLocalized(guest.bio, language)}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-brand-gold/10 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Faculty Allocation</span>
                  <span className="font-mono text-brand-gold">UFUQ ’26</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
