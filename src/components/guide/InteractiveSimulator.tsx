'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckCircle,
  Calendar,
  Sparkles,
  Download,
  ShieldCheck,
  QrCode,
  Music,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGuideStore } from '@/store/guideStore';
import { soundFx } from '@/lib/soundFx';

export default function InteractiveSimulator() {
  const { language } = useApp();
  const { soundEnabled } = useGuideStore();
  const [activeTab, setActiveTab] = useState<'search' | 'verify' | 'calendar'>('search');

  // Search Sandbox State
  const [searchQuery, setSearchQuery] = useState('scholarship');

  // Verification Sandbox State
  const [refInput, setRefInput] = useState('UF26-8942');
  const [verifiedState, setVerifiedState] = useState<null | {
    id: string;
    name: string;
    dars: string;
    status: 'Approved' | 'Pending';
    track: string;
  }>({
    id: 'UF26-8942',
    name: 'Muhammad Fayiz',
    dars: 'SUFFA Alathurpadi Markaz',
    status: 'Approved',
    track: 'Higher Academic Transition (JNU/AMU)',
  });

  const sampleSearchQueries = [
    { label: 'Scholarship', query: 'scholarship' },
    { label: 'Campus Map', query: 'campus' },
    { label: 'Fiqh Halqa', query: 'fiqh' },
    { label: 'Civil Service', query: 'upsc' },
  ];

  const simulatedResults = [
    {
      title: 'International Higher Education & Fellowships',
      category: 'Day 4 · Academic Horizon',
      snippet: 'Al-Azhar, European fellowships, Central University Entrance roadmaps.',
      match: ['scholarship', 'academic', 'fellowship'],
    },
    {
      title: 'Civil Services & State Governance Workshop',
      category: 'Day 5 · Leadership Horizon',
      snippet: 'UPSC preparation and ethical public administration with senior mentors.',
      match: ['upsc', 'service', 'leadership', 'civil'],
    },
    {
      title: 'Alathurpadi Dars Campus Blueprint & Logistics',
      category: 'Venue & Logistics',
      snippet: 'Prayer halls, guest quarters, dining hall, and reception helpdesk.',
      match: ['campus', 'venue', 'map', 'hall'],
    },
    {
      title: 'Classical Jurisprudence in Modern Contexts',
      category: 'Day 2 · Heritage Horizon',
      snippet: 'Methodology of contemporary Fatwa and moral discernment.',
      match: ['fiqh', 'halqa', 'shariah', 'ilm'],
    },
  ].filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.match.some((m) => m.includes(q))
    );
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.success(soundEnabled);
    soundFx.haptic(15);
    setVerifiedState({
      id: refInput.trim().toUpperCase() || 'UF26-8942',
      name: 'Muhammad Fayiz K.',
      dars: 'Markazu Suffa Dars, Malappuram',
      status: 'Approved',
      track: 'Higher Academic Transition & Research',
    });
  };

  const handleDownloadFullCalendar = () => {
    soundFx.success(soundEnabled);
    const fullIcs = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UFUQ 26//Master Camp Event//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:أُفُق — UFUQ ’26 (Transition & Leadership Camp)
DESCRIPTION:Rooted in Ilm. Ready for the World. Seven-day leadership camp organized by ADSA for SUFFA Dars students.
DTSTART:20261224T083000Z
DTEND:20261230T170000Z
LOCATION:Alathurpadi Dars Campus, Malappuram, Kerala, India
URL:https://alathurpadidars.in
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([fullIcs], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'UFUQ26-Master-Event-Calendar.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
            {language === 'ml' ? 'ഇന്ററാക്ടീവ് സിമുലേറ്റർ' : language === 'ar' ? 'المحاكي التفاعلي المباشر' : 'Live Feature Playground'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-clash font-bold text-brand-navy dark:text-white mt-1">
            {language === 'ml' ? 'സവിശേഷതകൾ മുൻകൂട്ടി പരീക്ഷിക്കൂ' : language === 'ar' ? 'جرّب الميزات عملياً هنا' : 'Practice Before You Step In'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          {language === 'ml'
            ? 'സ്മാർട്ട് സെർച്ച്, റഫറൻസ് പരിശോധന, കലണ്ടർ സിങ്ക് തുടങ്ങിയ പ്രധാന ഫീച്ചറുകൾ ഇവിടെ ലൈവായി പരീക്ഷിച്ചുനോക്കാം.'
            : language === 'ar'
            ? 'جرب أدوات البحث المتقدم وفحص حالة بطاقة المندوب وتنزيل مواعيد المخيم لهاتفك دون مغادرة هذه الصفحة.'
            : 'Interactive sandboxes allowing delegates to preview search dynamics, delegate credential validation, and calendar export.'}
        </p>
      </div>

      {/* Simulator Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-3 mb-6">
        <button
          onClick={() => {
            soundFx.click(soundEnabled);
            setActiveTab('search');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'search'
              ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{language === 'ml' ? 'സ്മാർട്ട് സെർച്ച് സിമുലേറ്റർ' : language === 'ar' ? 'محاكي البحث الفوري' : 'Live Search (⌘K)'}</span>
        </button>

        <button
          onClick={() => {
            soundFx.click(soundEnabled);
            setActiveTab('verify');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'verify'
              ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'ml' ? 'പാസ്സ് പരിശോധന' : language === 'ar' ? 'التحقق من بطاقة المندوب' : 'Credential Validation'}</span>
        </button>

        <button
          onClick={() => {
            soundFx.click(soundEnabled);
            setActiveTab('calendar');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'calendar'
              ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'ml' ? 'കലണ്ടർ സിങ്ക്' : language === 'ar' ? 'تصدير التقويم .ics' : 'Calendar .ICS Sync'}</span>
        </button>
      </div>

      {/* Simulator Content Panels */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/30 shadow-xl relative overflow-hidden">
        {/* TAB 1: SEARCH SIMULATOR */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="sim-search" className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                {language === 'ml' ? 'സെർച്ച് പരീക്ഷിച്ചു നോക്കൂ' : language === 'ar' ? 'جرّب كتابة أي كلمة مفتاحية' : 'Type or Select a Sample Keyword'}
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gold" />
                <input
                  id="sim-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ml' ? 'വിഷയം, അതിഥികൾ, സൗകര്യങ്ങൾ...' : language === 'ar' ? 'ابحث عن الجلسات، أو المشايخ، أو السكن...' : 'Search sessions, speakers, facilities...'}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-brand-navy/60 border border-neutral-300 dark:border-white/15 focus:outline-none focus:border-brand-gold text-sm text-brand-navy dark:text-white placeholder:text-neutral-400 shadow-inner"
                />
              </div>

              {/* Sample Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-neutral-400">{language === 'ml' ? 'മാതൃകകൾ:' : language === 'ar' ? 'أمثلة جاهزة:' : 'Sample queries:'}</span>
                {sampleSearchQueries.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundFx.click(soundEnabled);
                      setSearchQuery(chip.query);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      searchQuery === chip.query
                        ? 'bg-brand-gold text-brand-navy border-brand-gold font-bold'
                        : 'bg-black/5 dark:bg-white/5 border-neutral-300 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-brand-gold'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                {simulatedResults.length} {language === 'ml' ? 'ഫലങ്ങൾ കണ്ടെത്തി' : language === 'ar' ? 'نتائج مطابقة' : 'matching records found'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {simulatedResults.length > 0 ? (
                  simulatedResults.map((res, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 hover:border-brand-gold/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/30 mb-2 font-mono">
                          {res.category}
                        </span>
                        <h4 className="text-sm font-bold text-brand-navy dark:text-white mb-1">
                          {res.title}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                          {res.snippet}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-neutral-400 text-sm">
                    {language === 'ml' ? 'ഫലങ്ങളൊന്നും ലഭ്യമല്ല' : language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No records match this query in the simulator.'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CREDENTIAL VERIFICATION SANDBOX */}
        {activeTab === 'verify' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2 block">
                {language === 'ml' ? 'റഫറൻസ് പരിശോധന' : language === 'ar' ? 'التحقق السريع من رمز المندوب' : 'Simulate Reference Verification'}
              </span>
              <h3 className="text-xl sm:text-2xl font-clash font-bold text-brand-navy dark:text-white mb-3">
                {language === 'ml' ? 'അംഗീകൃത ബാഡ്ജ് പ്രിവ്യൂ' : language === 'ar' ? 'معاينة بطاقة المندوب الرقمية' : 'Digital Delegate Badge Preview'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                {language === 'ml'
                  ? 'നിങ്ങളുടെ രജിസ്ട്രേഷൻ റഫറൻസ് കോഡ് നൽകുമ്പോൾ ക്യാമ്പസ് എൻട്രിക്ക് ആവശ്യമായ ഒഫീഷ്യൽ പാസ്സ് എങ്ങനെ കാണപ്പെടുന്നു എന്ന് പരീക്ഷിക്കുക.'
                  : language === 'ar'
                  ? 'أدخل رمز التسجيل الخاص بك لمعاينة كيف تبدو بطاقتك الرسمية المعتمدة للدخول إلى قاعات المخيم.'
                  : 'Enter any reference code to experience how the verified digital credential looks with instant authorization status.'}
              </p>

              <form onSubmit={handleVerifySubmit} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder="e.g. UF26-8942"
                  className="px-4 py-3 rounded-xl bg-white dark:bg-brand-navy/60 border border-neutral-300 dark:border-white/15 focus:outline-none focus:border-brand-gold text-sm font-mono uppercase text-brand-navy dark:text-white shadow-inner flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold text-sm shadow-md transition-all shrink-0"
                >
                  {language === 'ml' ? 'പരിശോധിക്കുക' : language === 'ar' ? 'فحص الحالة' : 'Verify'}
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>{language === 'ml' ? 'മാതൃക കോഡുകൾ ഉപയോഗിക്കാം' : language === 'ar' ? 'محاكاة تفاعلية فورية' : 'Instant interactive preview (safe for testing)'}</span>
              </div>
            </div>

            {/* Holographic Delegate Badge Preview Card */}
            {verifiedState && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative rounded-3xl p-6 bg-gradient-to-br from-brand-navy via-brand-dark-surface to-brand-navy border-2 border-brand-gold/60 text-white shadow-2xl overflow-hidden"
              >
                {/* Gold Sheen Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 border-b border-brand-gold/25 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase block">
                      SUFFA DARS · OFFICIAL DELEGATE PASS
                    </span>
                    <h4 className="text-lg font-clash font-bold text-white mt-0.5">
                      UFUQ ’26 — أُفُق
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle className="w-3 h-3" />
                    {verifiedState.status}
                  </span>
                </div>

                <div className="space-y-3 mb-5 text-xs">
                  <div>
                    <span className="text-white/50 text-[10px] uppercase">{language === 'ml' ? 'വിദ്യാർത്ഥിയുടെ പേര്' : language === 'ar' ? 'اسم المندوب' : 'Delegate Name'}</span>
                    <div className="font-bold text-sm text-white">{verifiedState.name}</div>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] uppercase">{language === 'ml' ? 'അംഗീകൃത ദർസ്' : language === 'ar' ? 'حلقة الصفة التابع لها' : 'Endorsed SUFFA Dars'}</span>
                    <div className="text-neutral-200">{verifiedState.dars}</div>
                  </div>
                  <div>
                    <span className="text-white/50 text-[10px] uppercase">{language === 'ml' ? 'റഫറൻസ് നമ്പർ' : language === 'ar' ? 'رمز الاعتماد' : 'Credential Token'}</span>
                    <div className="font-mono text-brand-gold font-bold">{verifiedState.id}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-gold/20 flex items-center justify-between text-[11px] text-white/60">
                  <span>Alathurpadi Dars Campus</span>
                  <span className="font-mono text-brand-gold-light">Dec 24–30, 2026</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TAB 3: CALENDAR ICS SYNC SANDBOX */}
        {activeTab === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8 py-2"
          >
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2 block">
                {language === 'ml' ? 'ഓട്ടോമാറ്റിക് കലണ്ടർ സിങ്ക്' : language === 'ar' ? 'المزامنة مع تقويم الهاتف' : 'Never Miss a Horizon Session'}
              </span>
              <h3 className="text-xl sm:text-2xl font-clash font-bold text-brand-navy dark:text-white mb-3">
                {language === 'ml' ? 'മുഴുവൻ ക്യാമ്പ് ഇവന്റുകളും ഫോണിലേക്ക്' : language === 'ar' ? 'حمّل كامل فعاليات المخيم في هاتفك' : 'Download Master Camp Event (.ics)'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                {language === 'ml'
                  ? 'ഒരൊറ്റ ക്ലിക്കിലൂടെ ഡിസംബർ 24 മുതൽ 30 വരെയുള്ള പ്രധാന പ്രോഗ്രാമുകൾ ഗൂഗിൾ കലണ്ടർ, ആപ്പിൾ കലണ്ടർ എന്നിവയിലേക്ക് ആഡ് ചെയ്യാം.'
                  : language === 'ar'
                  ? 'بنقرة واحدة يمكنك إضافة كامل جدول أُفُق ’26 إلى تقويم جوجل، أو تقويم أبل، أو آوتلوك مع التنبيهات المسبقة.'
                  : 'Universal .ics format automatically integrates with Apple Calendar, Google Calendar, and Microsoft Outlook with punctual notification reminders.'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadFullCalendar}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ml' ? 'മാസ്റ്റർ കലണ്ടർ ഡൗൺലോഡ് ചെയ്യുക (.ics)' : language === 'ar' ? 'تحميل ملف التقويم الكامل (.ics)' : 'Download Master Event (.ics)'}</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-brand-gold/30 text-center max-w-xs shrink-0 shadow-lg">
              <Calendar className="w-12 h-12 text-brand-gold mx-auto mb-3" />
              <div className="font-clash font-bold text-sm text-brand-navy dark:text-white mb-1">
                Dec 24 – Dec 30, 2026
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Alathurpadi Dars Campus, Malappuram
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
