'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { Search, X, Calendar, User, HelpCircle, ArrowRight, BookOpen, Image as ImageIcon } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { schedule, guests, faqs, galleryItems } = useEvent();
  const { language, t, isRtl } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Global shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or direct state
          const event = new CustomEvent('open-search-modal');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingSessions = q
    ? schedule.filter((s) => {
        const title = resolveLocalized(s.title, language).toLowerCase();
        const desc = resolveLocalized(s.description, language).toLowerCase();
        const cat = (s.category || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || cat.includes(q);
      })
    : [];

  const matchingGuests = q
    ? guests.filter((g) => {
        const name = resolveLocalized(g.name, language).toLowerCase();
        const title = resolveLocalized(g.title, language).toLowerCase();
        const bio = resolveLocalized(g.bio, language).toLowerCase();
        return name.includes(q) || title.includes(q) || bio.includes(q);
      })
    : [];

  const matchingFAQs = q
    ? faqs.filter((f) => {
        const question = resolveLocalized(f.question, language).toLowerCase();
        const answer = resolveLocalized(f.answer, language).toLowerCase();
        return question.includes(q) || answer.includes(q);
      })
    : [];

  const aboutTopics = [
    {
      id: 'topic-heritage',
      title: 'Alathurpadi Dars — Classical Islamic Heritage & Halaqah',
      desc: 'The historic seat of classical Islamic scholarship in Malabar preserving unbroken Isnad and residential dars traditions.',
      url: '/about#heritage',
      category: 'About & Heritage',
    },
    {
      id: 'topic-leadership',
      title: 'Respected Ustads — Ustad Dr. C K Abdurahman Faizy Aripra',
      desc: 'Patron, Mudarris & Chief Spiritual Guide blending classical Ilm with doctoral academic rigor.',
      url: '/about#leadership',
      category: 'Spiritual Leadership',
    },
    {
      id: 'topic-adsa',
      title: 'ADSA — Alathurpadi Dars Students Association',
      desc: 'Official governing body uniting active scholars and global alumni.',
      url: '/about#pillars',
      category: 'Organization',
    },
    {
      id: 'topic-suffa',
      title: 'SUFFA Dars — Scholars Union For Fundamental Activities',
      desc: 'Vibrant student body cultivating research circles and academic excellence across 39+ Dars centers.',
      url: '/about#pillars',
      category: 'Student Fraternity',
    },
    {
      id: 'topic-suhba',
      title: 'SUHBA (صُحْبَة) — Sacred Fellowship & Lifelong Mentorship',
      desc: 'The timeless Islamic philosophy of mentorship, companionship, and ethical osmosis in university corridors.',
      url: '/about#suhba',
      category: 'Philosophy',
    },
    {
      id: 'topic-dars-network',
      title: '39+ SUFFA Dars Institutions Directory',
      desc: 'Searchable confederation of affiliated Dars institutions across Kerala with Mudarris contacts.',
      url: '/about#dars-network',
      category: 'Directory',
    },
    {
      id: 'topic-camp-matrix',
      title: 'Camp UFUQ ’26 — 7-Day Transformation Matrix',
      desc: 'December 24–30, 2026. 7-day residential leadership and transition bootcamp.',
      url: '/about#camp-matrix',
      category: 'Curriculum',
    },
    {
      id: 'topic-digital-craft',
      title: 'Web Application & Innovative Digital Features',
      desc: 'Next.js 15, Web Audio API frequency spectrum, trilingual engine, and dual portal architecture.',
      url: '/about#digital-craft',
      category: 'Digital Innovation',
    },
    {
      id: 'topic-gallery',
      title: 'Horizon Gallery & Visual Sanctuary',
      desc: 'Curated visual archive of Camp UFUQ ’26, Alathurpadi Dars, respected Ustads, SUFFA network, and Suhbah moments.',
      url: '/gallery',
      category: 'Visual Sanctuary',
    },
  ];

  const matchingTopics = q
    ? aboutTopics.filter((t) => {
        return (
          t.title.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
    : [];

  const matchingGallery = q
    ? galleryItems.filter((g) => {
        if (!g.published) return false;
        const title = resolveLocalized(g.title, language).toLowerCase();
        const caption = resolveLocalized(g.caption, language).toLowerCase();
        const tagMatch = g.tags.some((t) => t.toLowerCase().includes(q));
        return title.includes(q) || caption.includes(q) || tagMatch;
      })
    : [];

  const totalResults = matchingSessions.length + matchingGuests.length + matchingFAQs.length + matchingTopics.length + matchingGallery.length;

  const handleSelect = (target: string) => {
    onClose();
    if (target.startsWith('/')) {
      window.location.href = target;
    } else {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/' + target;
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search camp details"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl glass-panel shadow-2xl border border-brand-gold/30 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-gold/15 bg-white/50 dark:bg-black/40">
          <Search className="w-5 h-5 text-brand-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.search') + " (schedule, speakers, questions...)"}
            className="w-full bg-transparent text-sm md:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-neutral-500">
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="text-center py-8 text-neutral-500 text-sm">
              <p>Type keywords to search across UFUQ ’26 schedule, speakers, and FAQs.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Dars Heritage', 'Usthad', 'SUHBA', 'ADSA', 'SUFFA', 'Schedule', 'Academics'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-3 py-1 rounded-full text-xs bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-10 text-neutral-400 text-sm">
              {t('common.noResults')} for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Sessions */}
          {matchingSessions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2 px-2">
                <Calendar className="w-3.5 h-3.5" />
                Schedule Sessions ({matchingSessions.length})
              </div>
              <div className="space-y-1.5">
                {matchingSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelect('#schedule')}
                    className="w-full text-left rtl:text-right p-3 rounded-xl hover:bg-brand-gold/10 dark:hover:bg-brand-gold/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-mono text-brand-teal font-medium mb-0.5">
                        Day {session.day} • {session.startTime} - {session.endTime}
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-gold">
                        {resolveLocalized(session.title, language)}
                      </div>
                      {session.description && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {resolveLocalized(session.description, language)}
                        </div>
                      )}
                    </div>
                    <ArrowRight className={`w-4 h-4 text-neutral-400 group-hover:text-brand-gold shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guests */}
          {matchingGuests.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2 px-2">
                <User className="w-3.5 h-3.5" />
                Speakers & Leadership ({matchingGuests.length})
              </div>
              <div className="space-y-1.5">
                {matchingGuests.map((guest) => (
                  <button
                    key={guest.id}
                    onClick={() => handleSelect('#guests')}
                    className="w-full text-left rtl:text-right p-3 rounded-xl hover:bg-brand-gold/10 dark:hover:bg-brand-gold/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-gold">
                        {resolveLocalized(guest.name, language)}
                      </div>
                      {guest.title && (
                        <div className="text-xs text-brand-teal font-medium mt-0.5">
                          {resolveLocalized(guest.title, language)}
                        </div>
                      )}
                    </div>
                    <ArrowRight className={`w-4 h-4 text-neutral-400 group-hover:text-brand-gold shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* About & Heritage Topics */}
          {matchingTopics.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2 px-2">
                <BookOpen className="w-3.5 h-3.5" />
                About & Heritage ({matchingTopics.length})
              </div>
              <div className="space-y-1.5">
                {matchingTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelect(topic.url)}
                    className="w-full text-left rtl:text-right p-3 rounded-xl hover:bg-brand-gold/10 dark:hover:bg-brand-gold/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-brand-teal dark:text-emerald-400 font-medium mb-0.5 uppercase">
                        {topic.category}
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-gold">
                        {topic.title}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {topic.desc}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-neutral-400 group-hover:text-brand-gold shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {matchingFAQs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2 px-2">
                <HelpCircle className="w-3.5 h-3.5" />
                FAQs ({matchingFAQs.length})
              </div>
              <div className="space-y-1.5">
                {matchingFAQs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleSelect('#faq')}
                    className="w-full text-left rtl:text-right p-3 rounded-xl hover:bg-brand-gold/10 dark:hover:bg-brand-gold/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-gold">
                        {resolveLocalized(faq.question, language)}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {resolveLocalized(faq.answer, language)}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-neutral-400 group-hover:text-brand-gold shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Artifacts */}
          {matchingGallery.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-gold uppercase tracking-wider mb-2 px-2">
                <ImageIcon className="w-3.5 h-3.5" />
                Gallery Artifacts ({matchingGallery.length})
              </div>
              <div className="space-y-1.5">
                {matchingGallery.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(`/gallery?item=${item.id}`)}
                    className="w-full text-left rtl:text-right p-3 rounded-xl hover:bg-brand-gold/10 dark:hover:bg-brand-gold/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-brand-gold uppercase tracking-wider font-semibold">
                        {item.category.replace('_', ' ')}
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-gold">
                        {resolveLocalized(item.title, language)}
                      </div>
                      {item.caption && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                          {resolveLocalized(item.caption, language)}
                        </div>
                      )}
                    </div>
                    <ArrowRight className={`w-4 h-4 text-neutral-400 group-hover:text-brand-gold shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
