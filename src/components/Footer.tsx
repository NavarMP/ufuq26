'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { Heart, ShieldCheck, ArrowUp, Download } from 'lucide-react';

export default function Footer() {
  const { eventInfo } = useEvent();
  const { language, t } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      className="border-t border-brand-gold/20 pt-16 pb-24 md:pb-16 px-4 bg-black/5 dark:bg-black/30"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4 text-left rtl:text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-navy p-2 flex items-center justify-center border border-brand-gold/30">
                <Image
                  src="/images/UFUQ-Logo.svg"
                  alt="UFUQ '26"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-clash text-xl font-bold text-brand-navy dark:text-white leading-tight">
                  UFUQ ’26
                </h3>
                <span className="font-arabic text-xs text-brand-gold">
                  أُفُق — معسكر الانتقال والقيادة
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              &ldquo;{resolveLocalized(eventInfo.tagline, language)}&rdquo; — A week-long transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for graduating students from SUFFA Dars.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="w-6 h-6 relative opacity-80">
                <Image
                  src="/images/adsa-logo.svg"
                  alt="ADSA"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] text-neutral-500 font-medium">
                Alathurpadi Dars Students Association (ADSA)
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs text-left rtl:text-right">
            <div className="space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Event
              </span>
              <ul className="space-y-2">
                <li>
                  <Link href="#home" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold">
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link href="#schedule" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold">
                    {t('nav.schedule')}
                  </Link>
                </li>
                <li>
                  <Link href="#guests" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold">
                    {t('nav.guests')}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Student Desk
              </span>
              <ul className="space-y-2">
                <li>
                  <Link href="#register" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold font-semibold">
                    {t('nav.register')}
                  </Link>
                </li>
                <li>
                  <Link href="#location" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold">
                    {t('contact.location')}
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold">
                    {t('nav.faq')}
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-brand-gold hover:underline font-mono">
                    {t('nav.admin')} Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Info & Back to Top */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end text-xs space-y-4">
            <div className="p-3.5 rounded-2xl glass-panel border border-brand-gold/20 text-left rtl:text-right w-full">
              <div className="font-bold text-brand-navy dark:text-brand-gold-light">
                December 24–30, 2026
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Alathurpadi Dars Campus, Malappuram
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium glass-panel border border-brand-gold/25 hover:border-brand-gold text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors"
              aria-label="Scroll to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2026 UFUQ ’26. Organized by Alathurpadi Dars Students Association (ADSA).
          </div>
          <div className="flex items-center gap-2">
            <span>Rooted in Ilm. Ready for the World.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
