'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  CalendarEvent,
  generateGoogleCalendarUrl,
  generateOutlookLiveUrl,
  generateSamsungCalendarIntent,
  downloadICalendarFile,
} from '@/lib/calendar/calendarGenerator';
import { detectPlatform, PlatformInfo } from '@/lib/calendar/platformDetector';
import { CalendarPlus, Check, ChevronDown, Download, ExternalLink, Smartphone } from 'lucide-react';

interface AddToCalendarDropdownProps {
  event: CalendarEvent;
  buttonLabel?: string;
}

export default function AddToCalendarDropdown({ event, buttonLabel = 'Add to Calendar' }: AddToCalendarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);
  const [added, setAdded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = () => {
    downloadICalendarFile(event, `${event.title.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    setAdded(true);
    setIsOpen(false);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleSamsung = () => {
    if (platform?.isAndroid) {
      window.location.href = generateSamsungCalendarIntent(event);
    }
    downloadICalendarFile(event, `${event.title.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    setAdded(true);
    setIsOpen(false);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-panel border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10 text-neutral-800 dark:text-neutral-200 transition-all shadow-sm"
        title="Add to your calendar"
      >
        {added ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500">Added!</span>
          </>
        ) : (
          <>
            <CalendarPlus className="w-3.5 h-3.5 text-brand-gold" />
            <span>{buttonLabel}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 rounded-2xl glass-panel border border-brand-gold/40 shadow-2xl p-1.5 z-40 animate-scale-in text-neutral-800 dark:text-neutral-200">
          <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
            <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
              Choose Calendar
            </span>
          </div>

          {/* Google Calendar */}
          <a
            href={generateGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded text-[10px] bg-red-500 text-white font-bold inline-flex items-center justify-center">
                G
              </span>
              <span>Google Calendar</span>
            </span>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-brand-gold" />
          </a>

          {/* Apple Calendar */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 transition-colors group text-left rtl:text-right"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded text-[10px] bg-neutral-800 text-white font-bold inline-flex items-center justify-center">
                🍎
              </span>
              <span>Apple Calendar</span>
            </span>
            <Download className="w-3 h-3 text-neutral-400 group-hover:text-brand-gold" />
          </button>

          {/* Samsung Calendar */}
          <button
            onClick={handleSamsung}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 transition-colors group text-left rtl:text-right"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded text-[10px] bg-blue-600 text-white font-bold inline-flex items-center justify-center">
                S
              </span>
              <span>Samsung Calendar</span>
            </span>
            <Smartphone className="w-3 h-3 text-neutral-400 group-hover:text-brand-gold" />
          </button>

          {/* Microsoft Outlook */}
          <a
            href={generateOutlookLiveUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded text-[10px] bg-sky-600 text-white font-bold inline-flex items-center justify-center">
                O
              </span>
              <span>Microsoft Outlook</span>
            </span>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-brand-gold" />
          </a>

          {/* Standard .ics */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 transition-colors group text-left rtl:text-right border-t border-white/10 mt-1 pt-1.5"
          >
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded text-[10px] bg-emerald-600 text-white font-bold inline-flex items-center justify-center">
                .ics
              </span>
              <span>Universal .ics File</span>
            </span>
            <Download className="w-3 h-3 text-neutral-400 group-hover:text-brand-gold" />
          </button>
        </div>
      )}
    </div>
  );
}
