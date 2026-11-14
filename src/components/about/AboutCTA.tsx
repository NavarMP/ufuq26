'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Sparkles, Calendar, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialIcons';

export default function AboutCTA() {
  const { t, isRtl } = useApp();

  return (
    <section
      aria-label="Call to Action"
      className="py-20 md:py-28 px-4 max-w-5xl mx-auto relative"
    >
      <div className="rounded-3xl glass-panel p-8 sm:p-12 md:p-16 border-2 border-brand-gold/40 shadow-2xl text-center relative overflow-hidden bg-gradient-to-b from-brand-gold/10 via-transparent to-brand-navy/10">
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-widest border border-brand-gold/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>December 24–30, 2026 · Alathurpadi</span>
          </div>

          <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white leading-tight">
            {t('aboutPage.cta.title')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('aboutPage.cta.desc')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/#register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-sm shadow-xl shadow-brand-gold/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('aboutPage.cta.registerBtn')}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href="/#schedule"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-panel hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-semibold text-sm border border-brand-gold/30 hover:border-brand-gold transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-brand-teal dark:text-emerald-400" />
              <span>{t('aboutPage.cta.scheduleBtn')}</span>
            </Link>
          </div>

          {/* Direct Organizer Contact Hotlines */}
          <div className="pt-8 border-t border-brand-gold/20 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600 dark:text-neutral-300">
            <a
              href="https://wa.me/919074525205"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>WhatsApp Helpline</span>
            </a>
            <a
              href="tel:+919074525205"
              className="inline-flex items-center gap-1.5 hover:text-brand-gold font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>+91 90745 25205</span>
            </a>
            <a
              href="mailto:alathurpadidars@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-brand-gold font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-brand-gold" />
              <span>alathurpadidars@gmail.com</span>
            </a>
            <a
              href="https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-brand-gold font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              <span>Campus Map</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
