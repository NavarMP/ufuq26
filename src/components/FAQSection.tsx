'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { WhatsAppIcon, XTwitterIcon } from '@/components/SocialIcons';
import {
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  PhoneCall,
  Globe,
  ExternalLink,
  Facebook,
  Instagram,
  Copy,
  Check,
} from 'lucide-react';

export default function FAQSection() {
  const { faqs } = useEvent();
  const { language, t } = useApp();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

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
        <div className="space-y-8">
          {/* Header */}
          <div className="max-w-3xl space-y-2 text-left rtl:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {t('contact.title')}
            </span>
            <h3 className="font-clash text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy dark:text-white">
              {t('contact.subtitle')}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {t('contact.description')}
            </p>
          </div>

          {/* Primary Action Buttons: Phone, WhatsApp, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Phone Button */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-gold/25 hover:border-brand-gold transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/20 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('9074525205', 'phone')}
                    aria-label={t('contact.copyPhone')}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'phone' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-medium">{t('contact.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">{t('contact.copyPhone')}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-1 text-left rtl:text-right">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {t('contact.phone')}
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold text-brand-navy dark:text-white">
                    +91 90745 25205
                  </div>
                </div>
              </div>
              <a
                href="tel:+919074525205"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-brand-navy text-brand-gold dark:bg-brand-gold dark:text-brand-navy font-bold text-xs shadow hover:opacity-95 transition-all active:scale-[0.98]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('contact.callNow')}</span>
              </a>
            </div>

            {/* WhatsApp Button */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <WhatsAppIcon className="w-5 h-5 fill-current" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Instant Response
                  </span>
                </div>
                <div className="space-y-1 text-left rtl:text-right">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {t('contact.whatsapp')}
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    +91 90745 25205
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/919074525205?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20UFUQ%20%E2%80%9926"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>{t('contact.chatOnWhatsapp')}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            </div>

            {/* Email Button */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-brand-gold/25 hover:border-brand-gold transition-all duration-200 flex flex-col justify-between group sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('alathurpadidars@gmail.com', 'email')}
                    aria-label={t('contact.copyEmail')}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'email' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-medium">{t('contact.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">{t('contact.copyEmail')}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-1 text-left rtl:text-right">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {t('contact.email')}
                  </span>
                  <div className="font-mono text-xs sm:text-sm font-bold text-brand-navy dark:text-white truncate" title="alathurpadidars@gmail.com">
                    alathurpadidars@gmail.com
                  </div>
                </div>
              </div>
              <a
                href="mailto:alathurpadidars@gmail.com?subject=UFUQ%20'26%20Inquiry"
                className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl glass-panel border border-brand-gold/40 hover:border-brand-gold text-brand-navy dark:text-white font-bold text-xs shadow hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                <Mail className="w-3.5 h-3.5 text-brand-gold" />
                <span>{t('contact.sendEmail')}</span>
              </a>
            </div>
          </div>

          {/* Secondary bar: Location, Website, Verified Social Channels */}
          <div className="pt-4 border-t border-brand-gold/15 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://alathurpadidars.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel border border-brand-gold/25 hover:border-brand-gold text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-brand-gold" />
                <span>alathurpadidars.in</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href="https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel border border-brand-gold/25 hover:border-brand-gold text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span>Google Maps Location</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>

            {/* Social channels pill list */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mr-1">
                {t('contact.socialChannels')}:
              </span>
              <a
                href="https://www.facebook.com/alathoorpadidars/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook: alathoorpadidars"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors border border-blue-600/20"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>

              <a
                href="https://www.instagram.com/alathurpadi_dars"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram: @alathurpadi_dars"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 text-pink-600 dark:text-pink-400 text-xs font-medium transition-colors border border-pink-600/20"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>

              <a
                href="https://x.com/ALATHURPADARS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter: @ALATHURPADARS"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/10 hover:bg-neutral-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors border border-neutral-400/20"
              >
                <XTwitterIcon className="w-3.5 h-3.5 fill-current" />
                <span>X (Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
