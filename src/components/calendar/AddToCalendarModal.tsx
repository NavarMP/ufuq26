'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarEvent,
  generateGoogleCalendarUrl,
  generateOutlookLiveUrl,
  generateOffice365Url,
  generateSamsungCalendarIntent,
  generateYahooCalendarUrl,
  downloadICalendarFile,
  formatClipboardEvent,
} from '@/lib/calendar/calendarGenerator';
import { detectPlatform, PlatformInfo } from '@/lib/calendar/platformDetector';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  X,
  Check,
  Copy,
  ExternalLink,
  Download,
  Sparkles,
  Smartphone,
  MapPin,
  Clock,
} from 'lucide-react';

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
}

export default function AddToCalendarModal({ isOpen, onClose, event }: AddToCalendarModalProps) {
  const { language, isRtl } = useApp();
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadedIcs, setDownloadedIcs] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatClipboardEvent(event));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleDownloadIcs = () => {
    downloadICalendarFile(event, `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 2500);
  };

  const handleSamsungCalendar = () => {
    if (platform?.isAndroid) {
      const intentUrl = generateSamsungCalendarIntent(event);
      window.location.href = intentUrl;
      // Fallback after 600ms if intent not captured
      setTimeout(() => {
        downloadICalendarFile(event, 'Samsung_UFUQ26_Event.ics');
      }, 700);
    } else {
      downloadICalendarFile(event, 'Samsung_UFUQ26_Event.ics');
    }
  };

  const startDateFormatted = new Date(event.startDate).toLocaleString(language === 'ml' ? 'ml-IN' : language === 'ar' ? 'ar-SA' : 'en-IN', {
    dateStyle: 'medium',
    timeStyle: event.allDay ? undefined : 'short',
    timeZone: 'Asia/Kolkata',
  });

  const endDateFormatted = new Date(event.endDate).toLocaleString(language === 'ml' ? 'ml-IN' : language === 'ar' ? 'ar-SA' : 'en-IN', {
    dateStyle: 'medium',
    timeStyle: event.allDay ? undefined : 'short',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-7 overflow-hidden text-neutral-800 dark:text-neutral-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Add Event to Calendar"
      >
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full bg-brand-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-brand-teal/15 blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white">
                Add to Calendar
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Choose your preferred calendar service
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-panel border border-brand-gold/20 flex items-center justify-center hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event Preview Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/25 space-y-1.5 shrink-0 text-left rtl:text-right">
          <h4 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-brand-gold-light line-clamp-1">
            {event.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-brand-teal shrink-0" />
            <span>{startDateFormatted} — {endDateFormatted}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Calendar Provider Options */}
        <div className="mt-5 space-y-2.5 overflow-y-auto pr-1 no-scrollbar flex-1">
          {/* 1. Google Calendar */}
          <a
            href={generateGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl glass-panel border hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 group ${
              platform?.recommendedCalendar === 'google'
                ? 'border-brand-gold bg-brand-gold/15 shadow-sm'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-red-500 font-bold text-sm">
                G
              </div>
              <div className="text-left rtl:text-right">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-brand-navy dark:text-white">
                    Google Calendar
                  </span>
                  {platform?.recommendedCalendar === 'google' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-navy">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-500">Android, Chrome & Web</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* 2. Apple Calendar */}
          <button
            onClick={() => {
              handleDownloadIcs();
              setTimeout(onClose, 800);
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl glass-panel border hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 group ${
              platform?.recommendedCalendar === 'apple'
                ? 'border-brand-gold bg-brand-gold/15 shadow-sm'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white shadow-sm flex items-center justify-center text-xs font-semibold">
                🍎
              </div>
              <div className="text-left rtl:text-right">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-brand-navy dark:text-white">
                    Apple Calendar
                  </span>
                  {platform?.recommendedCalendar === 'apple' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-navy">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-500">iPhone, iPad & Mac (1-Tap Import)</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold transition-colors" />
          </button>

          {/* 3. Samsung Calendar */}
          <button
            onClick={() => {
              handleSamsungCalendar();
              setTimeout(onClose, 800);
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl glass-panel border hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 group ${
              platform?.recommendedCalendar === 'samsung'
                ? 'border-brand-gold bg-brand-gold/15 shadow-sm'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm flex items-center justify-center text-xs font-bold">
                S
              </div>
              <div className="text-left rtl:text-right">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-brand-navy dark:text-white">
                    Samsung Calendar
                  </span>
                  {platform?.recommendedCalendar === 'samsung' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-navy">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-500">Samsung Galaxy One UI devices</span>
              </div>
            </div>
            <Smartphone className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold transition-colors" />
          </button>

          {/* 4. Microsoft Outlook Live */}
          <a
            href={generateOutlookLiveUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white shadow-sm flex items-center justify-center text-xs font-bold">
                O
              </div>
              <div className="text-left rtl:text-right">
                <span className="font-semibold text-xs sm:text-sm text-brand-navy dark:text-white block">
                  Microsoft Outlook
                </span>
                <span className="text-[11px] text-neutral-500">Outlook.com, Live & Hotmail</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* 5. Microsoft 365 (Office / School Accounts) */}
          <a
            href={generateOffice365Url(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white shadow-sm flex items-center justify-center text-xs font-bold">
                365
              </div>
              <div className="text-left rtl:text-right">
                <span className="font-semibold text-xs sm:text-sm text-brand-navy dark:text-white block">
                  Microsoft 365 / Office
                </span>
                <span className="text-[11px] text-neutral-500">University, Dars & Work accounts</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* 6. Universal .ics File */}
          <button
            onClick={handleDownloadIcs}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center justify-center text-xs font-bold">
                ICS
              </div>
              <div className="text-left rtl:text-right">
                <span className="font-semibold text-xs sm:text-sm text-brand-navy dark:text-white block">
                  Universal iCalendar (.ics)
                </span>
                <span className="text-[11px] text-neutral-500">Thunderbird, CalDAV & any desktop app</span>
              </div>
            </div>
            {downloadedIcs ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Download className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold transition-colors" />
            )}
          </button>
        </div>

        {/* Modal Footer: Copy Invite text */}
        <div className="mt-5 pt-3.5 border-t border-brand-gold/20 flex items-center justify-between shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-gold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy invite text to share</span>
              </>
            )}
          </button>
          <span className="text-[10px] text-neutral-400">Timezone: Asia/Kolkata (IST)</span>
        </div>
      </div>
    </div>
  );
}
