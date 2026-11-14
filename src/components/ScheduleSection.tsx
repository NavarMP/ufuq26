'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { resolveLocalized } from '@/lib/translations';
import { CAMP_DAY_THEMES } from '@/lib/scheduleData';
import { formatSessionsToIcs } from '@/lib/export/formatters/icsFormatter';
import { createTextBlob, triggerBlobDownload } from '@/lib/export/utils/downloadHelper';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  User,
  Download,
  CalendarPlus,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function ScheduleSection() {
  const { language, t, isRtl } = useApp();
  const { schedule } = useEvent();
  const { triggerLight, triggerSuccess } = useHapticFeedback();
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const activeTheme = CAMP_DAY_THEMES[activeDayIndex] || CAMP_DAY_THEMES[0];

  // Quick 1-click Download for full camp .ics
  const handleDownloadFullIcs = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerSuccess();
    soundEngine.playSuccess();

    const calendarItems = schedule.map((s) => ({
      id: s.id,
      title: resolveLocalized(s.title, language),
      description: s.description ? resolveLocalized(s.description, language) : `UFUQ ’26 - Day ${s.day} Session`,
      location: s.location || 'Alathurpadi Dars Campus & Conference Hall, Malappuram',
      startDate: `${s.date}T${s.startTime}:00+05:30`,
      endDate: `${s.date}T${s.endTime}:00+05:30`,
      category: s.category,
      url: 'https://alathurpadidars.in/schedule',
    }));

    const icsContent = formatSessionsToIcs(calendarItems, "UFUQ ’26 Full Horizon Schedule (Dec 24–30, 2026)");
    const blob = createTextBlob(icsContent, 'text/calendar', false);
    triggerBlobDownload(blob, 'UFUQ26_Full_Camp_Schedule.ics');
  };

  const selectDay = (index: number) => {
    setActiveDayIndex(index);
    triggerLight();
    soundEngine.playClick(1.0 + index * 0.05);
  };

  // Flagship keynote sessions for teaser highlight
  const keynoteSessions = [
    {
      day: 1,
      date: 'Dec 24',
      time: '09:00 – 11:15 AM',
      track: 'Orientation',
      title: {
        en: 'The Horizon Ahead: Welcome, Camp Ethos & Cohort Covenant',
        ml: 'മുന്നിലെ ചക്രവാളം: സ്വാഗതം, ക്യാമ്പ് ലക്ഷ്യങ്ങളും കൂട്ടായ്മയുടെ പ്രതിജ്ഞയും',
        ar: 'الأفق القادم: الترحيب، وروح المعسكر وميثاق الأخوة',
      },
      speaker: {
        en: 'Respected Patron Usthad (Alathurpadi Dars)',
        ml: 'ബഹുമാനപ്പെട്ട രക്ഷാധികാരി ഉസ്താദ് (അലത്തൂർപ്പാടി ദർസ്)',
        ar: 'فضيلة الأستاذ الراعي (دار العلثورپادي)',
      },
      venue: {
        en: 'Main Conference Auditorium',
        ml: 'പ്രധാന കോൺഫറൻസ് ഓഡിറ്റോറിയം',
        ar: 'قاعة المؤتمرات الكبرى',
      },
      tagColor: 'border-amber-400/50 bg-amber-400/10 text-amber-500 dark:text-amber-300',
    },
    {
      day: 3,
      date: 'Dec 26',
      time: '09:00 – 12:30 PM',
      track: 'Skills Workshop',
      title: {
        en: 'Language Mastery, Research Writing & Academic Communication',
        ml: 'ഭാഷാ പ്രാവീണ്യം, ഗവേഷണ രചന & ആശയവിനിമയം',
        ar: 'إتقان اللغة، والكتابة البحثية، والتواصل الأكاديمي',
      },
      speaker: {
        en: 'Central University Professors & Editorial Fellows',
        ml: 'സെൻട്രൽ യൂണിവേഴ്സിറ്റി പ്രൊഫസർമാർ',
        ar: 'أساتذة الجامعات المركزية',
      },
      venue: {
        en: 'SUFFA Academic Seminar Hall',
        ml: 'സുഫ്ഫ അക്കാദമിക് സെമിനാർ ഹാൾ',
        ar: 'قاعة صفا للدراسات',
      },
      tagColor: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300',
    },
    {
      day: 7,
      date: 'Dec 30',
      time: '15:30 – 18:15 PM',
      track: 'Valedictory',
      title: {
        en: 'Valedictory Assembly, Certificate Conferral & Blessed Du’a',
        ml: 'സമാപന സമ്മേളനം, സർട്ടിഫിക്കറ്റ് വിതരണം & അനുഗ്രഹീത ദുആ',
        ar: 'الحفل الختامي الكبير، وتوزيع الشهادات والدعاء المستجاب',
      },
      speaker: {
        en: 'Visiting Mashayikh & ADSA Leadership',
        ml: 'പ്രമുഖ പണ്ഡിതരും ADSA നേതൃത്വവും',
        ar: 'كبار العلماء وقيادة الجمعية',
      },
      venue: {
        en: 'Main Conference Auditorium',
        ml: 'പ്രധാന കോൺഫറൻസ് ഓഡിറ്റോറിയം',
        ar: 'قاعة المؤتمرات الكبرى',
      },
      tagColor: 'border-yellow-400/50 bg-yellow-400/10 text-yellow-600 dark:text-yellow-300',
    },
  ];

  return (
    <section
      id="schedule"
      aria-label="Camp Schedule Overview"
      className="py-20 md:py-32 px-4 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -right-48 w-96 h-96 rounded-full bg-brand-teal/10 blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-widest shadow-sm mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('schedule.homeTeaserTitle') || 'The 7-Day Horizon Journey'}</span>
        </div>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white tracking-tight">
          {t('schedule.subtitle') || 'Seven Days of Transformation'}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3 max-w-2xl mx-auto leading-relaxed">
          {t('schedule.homeTeaserSubtitle') ||
            'A systematic progression bridging classical Islamic scholarship (Ilm) with modern universities and global leadership.'}
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* 7-DAY MILESTONE HORIZON RIBBON */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-gold" />
            <span>Select Day to Preview Arc</span>
          </span>
          <span className="text-[11px] font-medium text-brand-gold">
            {activeTheme.formattedDate} · {activeTheme.hijriDate}
          </span>
        </div>

        {/* Horizontal Scrollable Day Rail */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {CAMP_DAY_THEMES.map((item, idx) => {
            const isSelected = activeDayIndex === idx;
            return (
              <button
                key={item.day}
                onClick={() => selectDay(idx)}
                className={`group relative p-3 sm:p-3.5 rounded-2xl text-left rtl:text-right transition-all duration-300 border ${
                  isSelected
                    ? 'glass-panel border-brand-gold shadow-lg shadow-brand-gold/20 scale-[1.02] bg-brand-gold/10'
                    : 'glass-panel border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/50 hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isSelected && (
                  <div className="absolute inset-x-4 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent rounded-full" />
                )}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-brand-gold text-brand-navy font-extrabold'
                        : 'bg-black/10 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    Day {item.day}
                  </span>
                  <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                    {item.formattedDate.split(',')[0]}
                  </span>
                </div>
                <h4
                  className={`mt-2 font-clash text-xs sm:text-sm font-bold line-clamp-1 transition-colors ${
                    isSelected ? 'text-brand-navy dark:text-brand-gold-light' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {resolveLocalized(item.title, language).split(':')[0]}
                </h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                  {resolveLocalized(item.keyMilestone, language)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY ACTIVE PREVIEW HERO CARD */}
      <div className="mb-14 rounded-3xl glass-panel p-6 sm:p-8 border-2 border-brand-gold/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-brand-navy/15 via-transparent to-brand-gold/5">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3 text-left rtl:text-right">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
                Day {activeTheme.day} Focus
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {activeTheme.formattedDate} · {activeTheme.hijriDate}
              </span>
            </div>
            <h3 className="font-clash text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white">
              {resolveLocalized(activeTheme.title, language)}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
              {resolveLocalized(activeTheme.description, language)}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span>
                  <strong>Lead:</strong> {resolveLocalized(activeTheme.leadFaculty, language)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-teal dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Milestone:</strong> {resolveLocalized(activeTheme.keyMilestone, language)}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col justify-end items-stretch md:items-end gap-3 shrink-0">
            <Link
              href={`/schedule?day=${activeTheme.day}`}
              onClick={() => soundEngine.playClick(1.2)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs sm:text-sm shadow-lg shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>View Day {activeTheme.day} Schedule</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <button
              onClick={handleDownloadFullIcs}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl glass-panel border border-brand-gold/40 hover:border-brand-gold text-neutral-700 dark:text-neutral-200 hover:text-brand-gold font-medium text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t('schedule.addCamp') || 'Add Camp (.ics)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KEYNOTE HIGHLIGHTS & CAMP RHYTHM BENTO */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <h3 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
              Flagship Masterclasses & Assemblies
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Curated keynote milestones from the seven-day residential schedule
            </p>
          </div>
          <Link
            href="/schedule"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-brand-gold-light group"
          >
            <span>See All 24+ Sessions</span>
            <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {keynoteSessions.map((session, i) => (
            <div
              key={i}
              className="group rounded-3xl glass-panel p-6 border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 shadow-xl hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3 text-left rtl:text-right">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${session.tagColor}`}>
                    Day {session.day} · {session.track}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    <Clock className="w-3 h-3 text-brand-gold" />
                    <span>{session.time}</span>
                  </div>
                </div>

                <h4 className="font-clash text-base sm:text-lg font-bold text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors leading-snug">
                  {resolveLocalized(session.title, language)}
                </h4>

                <div className="pt-2 border-t border-neutral-200/60 dark:border-white/10 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span className="line-clamp-1">{resolveLocalized(session.speaker, language)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="line-clamp-1">{resolveLocalized(session.venue, language)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200/40 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  {session.date}, 2026
                </span>
                <Link
                  href={`/schedule?day=${session.day}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-brand-gold-light"
                >
                  <span>Details</span>
                  <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAMP RHYTHM METRICS BAR */}
      <div className="mb-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-brand-gold/30 text-center space-y-1">
          <div className="font-clash text-3xl sm:text-4xl font-extrabold text-brand-gold">7 Days</div>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Residential Immersion</div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Dec 24 to Dec 30, 2026</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-brand-gold/30 text-center space-y-1">
          <div className="font-clash text-3xl sm:text-4xl font-extrabold text-brand-teal dark:text-emerald-400">24+ Modules</div>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">8 Specialized Tracks</div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Academics, Usul, SOP & Fellowships</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-brand-gold/30 text-center space-y-1">
          <div className="font-clash text-3xl sm:text-4xl font-extrabold text-brand-navy dark:text-brand-gold-light">15+ Faculty</div>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Scholars & Mentors</div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Traditional Mashayikh & University Profs</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-brand-gold/30 text-center space-y-1">
          <div className="font-clash text-3xl sm:text-4xl font-extrabold text-amber-500">100 Cohort</div>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Selected Delegates</div>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">SUFFA Dars graduating scholars</p>
        </div>
      </div>

      {/* DEDICATED SCHEDULE GATEWAY BANNER (HIGH-IMPACT CTA) */}
      <div className="rounded-3xl glass-panel p-8 sm:p-12 border-2 border-brand-gold/50 shadow-2xl bg-gradient-to-r from-brand-navy/20 via-brand-gold/15 to-brand-teal/20 relative overflow-hidden group hover:border-brand-gold transition-all duration-500">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-brand-gold/20 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"
        />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 text-center lg:text-left rtl:lg:text-right">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-extrabold uppercase tracking-widest border border-brand-gold/40">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Horizon Timetable</span>
            </div>
            <h3 className="font-clash text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy dark:text-white leading-tight">
              {t('schedule.pageTitle') || 'Interactive Camp Schedule & Horizon Timetable'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Explore the complete 7-day chronological stream with integrated prayer cadence, 7-Day comparative matrix,
              dual Gregorian & Hijri calendar, personal itinerary builder with clash detection, and universal calendar sync.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/schedule"
              onClick={() => soundEngine.playClick(1.2)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-sm sm:text-base shadow-2xl shadow-brand-gold/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>{t('schedule.exploreFullSchedule') || 'Explore Full Schedule'}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <button
              onClick={handleDownloadFullIcs}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full glass-panel border border-brand-gold/40 hover:border-brand-gold text-neutral-800 dark:text-neutral-100 hover:text-brand-gold font-semibold text-xs sm:text-sm transition-all shadow-sm"
              title="Download iCalendar file containing all camp sessions"
            >
              <CalendarPlus className="w-4 h-4 text-brand-gold" />
              <span>{t('schedule.addFullCampToCal') || 'Sync All 7 Days (.ics)'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
