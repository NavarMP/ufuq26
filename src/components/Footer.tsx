'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { WhatsAppIcon, XTwitterIcon } from '@/components/SocialIcons';
import {
  ArrowUp,
  ArrowUpRight,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand & Socials Column */}
          <div className="md:col-span-4 space-y-4 text-left rtl:text-right">
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

            <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-6 relative opacity-80 shrink-0">
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

            {/* Social Media Buttons */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2.5">
                {t('contact.socialChannels')}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://www.facebook.com/alathoorpadidars/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook: /alathoorpadidars"
                  title="Facebook /alathoorpadidars"
                  className="w-8 h-8 rounded-xl glass-panel border border-brand-gold/20 hover:border-blue-500 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all hover:scale-105"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="https://www.instagram.com/alathurpadi_dars"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram: @alathurpadi_dars"
                  title="Instagram @alathurpadi_dars"
                  className="w-8 h-8 rounded-xl glass-panel border border-brand-gold/20 hover:border-pink-500 text-neutral-600 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400 flex items-center justify-center transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://x.com/ALATHURPADARS"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter): @ALATHURPADARS"
                  title="X (Twitter) @ALATHURPADARS"
                  className="w-8 h-8 rounded-xl glass-panel border border-brand-gold/20 hover:border-neutral-500 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <XTwitterIcon className="w-3.5 h-3.5 fill-current" />
                </a>

                <a
                  href="https://alathurpadidars.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Official Website: alathurpadidars.in"
                  title="alathurpadidars.in"
                  className="w-8 h-8 rounded-xl glass-panel border border-brand-gold/20 hover:border-brand-gold text-neutral-600 dark:text-neutral-300 hover:text-brand-gold flex items-center justify-center transition-all hover:scale-105"
                >
                  <Globe className="w-4 h-4" />
                </a>

                <a
                  href="https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Campus Location on Google Maps"
                  title="Alathurpadi Dars on Google Maps"
                  className="w-8 h-8 rounded-xl glass-panel border border-brand-gold/20 hover:border-brand-gold text-neutral-600 dark:text-neutral-300 hover:text-brand-gold flex items-center justify-center transition-all hover:scale-105"
                >
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs text-left rtl:text-right">
            <div className="space-y-2.5">
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Event
              </span>
              <ul className="space-y-2">
                <li>
                  <Link href="/#home" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold font-semibold transition-colors flex items-center gap-1">
                    <span>{t('nav.about')}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-brand-gold/20 text-brand-gold">Dedicated</span>
                  </Link>
                </li>
                <li>
                  <Link href="/#schedule" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors">
                    {t('nav.schedule')}
                  </Link>
                </li>
                <li>
                  <Link href="/#guests" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors">
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
                  <Link href="/guide" className="text-brand-gold hover:text-brand-gold-light font-bold transition-colors flex items-center gap-1">
                    <span>Interactive Guide</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-mono">Guide</span>
                  </Link>
                </li>
                <li>
                  <Link href="#register" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold font-semibold transition-colors">
                    {t('nav.register')}
                  </Link>
                </li>
                <li>
                  <Link href="#location" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors">
                    {t('contact.location')}
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors">
                    {t('nav.faq')}
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors">
                    {t('contact.title')}
                  </Link>
                </li>
                <li>
                  <Link href="/dars" className="text-brand-gold hover:underline font-mono">
                    SUFFA Dars Portal
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

          {/* Contact & Support Column */}
          <div className="md:col-span-4 space-y-3 text-left rtl:text-right">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                {t('contact.title')}
              </span>
              <span className="text-[10px] text-brand-gold font-medium">ADSA Helpdesk</span>
            </div>

            <div className="space-y-2">
              {/* Phone Button */}
              <a
                href="tel:+919074525205"
                className="flex items-center justify-between p-2.5 rounded-xl glass-panel border border-brand-gold/20 hover:border-brand-gold transition-all text-xs group hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/20 shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      +91 90745 25205
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {t('contact.callNow')}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-gold transition-colors shrink-0 ml-1" />
              </a>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919074525205?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20UFUQ%20%E2%80%9926"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl glass-panel border border-emerald-500/25 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +91 90745 25205
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {t('contact.chatOnWhatsapp')}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500/70 group-hover:text-emerald-500 transition-colors shrink-0 ml-1" />
              </a>

              {/* Email Button */}
              <a
                href="mailto:alathurpadidars@gmail.com?subject=UFUQ%20'26%20Inquiry"
                className="flex items-center justify-between p-2.5 rounded-xl glass-panel border border-brand-gold/20 hover:border-brand-gold transition-all text-xs group hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/20 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-mono text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate" title="alathurpadidars@gmail.com">
                      alathurpadidars@gmail.com
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {t('contact.sendEmail')}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-gold transition-colors shrink-0 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Info & Back to Top Row */}
        <div className="pt-6 border-t border-brand-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-neutral-500 text-left rtl:text-right">
            <span className="font-semibold text-brand-navy dark:text-brand-gold-light">
              December 24–30, 2026
            </span>
            <span>•</span>
            <span>Alathurpadi Dars Campus, Malappuram</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium glass-panel border border-brand-gold/25 hover:border-brand-gold text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors"
            aria-label="Scroll to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-brand-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
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
