'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import {
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';

export default function FAQSection() {
  const { faqs } = useEvent();
  const { language, t } = useApp();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const publishedFaqs = faqs.filter((f) => f.published);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions and Support"
      className="py-20 md:py-32 px-4 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {t('faq.title')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          {t('faq.subtitle')}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
      </div>

      {/* Accordion List */}
      <div className="space-y-3 mb-16">
        {publishedFaqs.length === 0 ? (
          <div className="text-center py-12 rounded-3xl glass-panel">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-500 text-sm">{t('faq.noFaqs')}</p>
          </div>
        ) : (
          publishedFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl glass-panel border border-brand-gold/20 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left rtl:text-right flex items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <span className="font-clash text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {resolveLocalized(faq.question, language)}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-gold shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-brand-gold/10 animate-fade-in text-left rtl:text-right">
                    {resolveLocalized(faq.answer, language)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support & Official Channels Card */}
      <div
        id="contact"
        className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/30 shadow-2xl relative overflow-hidden"
      >
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3 text-left rtl:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {t('contact.title')}
            </span>
            <h3 className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">
              Need Assistance or Clarifications?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              The ADSA organizing committee is available to address student inquiries regarding eligibility, travel coordination, and accommodations.
            </p>

            {/* Official Links & Verified Channels */}
            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href="https://alathurpadidars.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-brand-gold/25 hover:border-brand-gold text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-brand-gold" />
                <span>alathurpadidars.in</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href="https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-brand-gold/25 hover:border-brand-gold text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span>Google Maps Location</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Social Links List */}
          <div className="md:col-span-5 flex flex-col gap-2.5 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Verified Official Channels
            </span>

            <a
              href="https://www.facebook.com/alathoorpadidars/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs text-neutral-700 dark:text-neutral-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook /alathoorpadidars</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-gold" />
            </a>

            <a
              href="https://www.instagram.com/alathurpadi_dars"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs text-neutral-700 dark:text-neutral-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>Instagram @alathurpadi_dars</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-gold" />
            </a>

            <a
              href="https://x.com/ALATHURPADARS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs text-neutral-700 dark:text-neutral-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Twitter className="w-4 h-4 text-sky-500" />
                <span>X (Twitter) @ALATHURPADARS</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-gold" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
