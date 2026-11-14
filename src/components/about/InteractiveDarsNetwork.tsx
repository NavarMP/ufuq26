'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { initialDarsList } from '@/lib/darsData';
import { Search, MapPin, Phone, Building2, ShieldCheck, Sparkles, Filter } from 'lucide-react';

export default function InteractiveDarsNetwork() {
  const { t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Extract unique districts if available or create smart categorizations
  const districts = useMemo(() => {
    const list = new Set<string>();
    initialDarsList.forEach((d) => {
      if (d.district) list.add(d.district);
    });
    return Array.from(list);
  }, []);

  // Filtered list based on search and district
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialDarsList.filter((d) => {
      const matchSearch =
        !q ||
        d.nameEn.toLowerCase().includes(q) ||
        d.nameMl.toLowerCase().includes(q) ||
        d.mudarris.toLowerCase().includes(q) ||
        d.regNo.toLowerCase().includes(q);

      const matchDistrict = selectedDistrict === 'all' || d.district === selectedDistrict;

      return matchSearch && matchDistrict;
    });
  }, [searchQuery, selectedDistrict]);

  return (
    <section
      id="dars-network"
      aria-label="39 SUFFA Dars Institutions Network"
      className="py-20 md:py-28 px-4 max-w-6xl mx-auto relative"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <Building2 className="w-3.5 h-3.5" />
          {t('aboutPage.darsNetwork.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.darsNetwork.title')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('aboutPage.darsNetwork.subtitle')}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 border border-brand-gold/30 shadow-xl mb-8 space-y-4">
        <div className="grid sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-brand-gold absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('aboutPage.darsNetwork.searchPlaceholder')}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-xs sm:text-sm text-neutral-800 dark:text-white placeholder:text-neutral-400"
            />
          </div>

          {/* Quick Clear or Count Pill */}
          <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-2 text-xs font-medium text-neutral-500">
            <span>
              Showing <strong className="text-brand-gold">{filteredList.length}</strong> of {initialDarsList.length} centers
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-brand-teal dark:text-emerald-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Lead Institution Banner (Alathurpadi Dars SDC01) */}
        <div className="p-3.5 rounded-2xl bg-brand-navy text-white border border-brand-gold/40 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold font-mono">
              ★
            </div>
            <div>
              <span className="font-bold text-brand-gold-light block">
                {t('aboutPage.darsNetwork.leadInstitution')}
              </span>
              <span className="text-[11px] text-neutral-300">
                Ustad Dr. C K Abdurahman Faizy Aripra · Melmuri, Malappuram
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-brand-gold text-brand-navy font-bold text-[10px] uppercase tracking-wider">
            Seat of Dars
          </span>
        </div>
      </div>

      {/* 39 Dars Interactive Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((dars) => {
          const isLead = dars.regNo === 'SDC01';
          return (
            <div
              key={dars.id}
              className={`rounded-2xl glass-panel p-5 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                isLead
                  ? 'border-brand-gold shadow-lg bg-brand-gold/5'
                  : 'border-brand-gold/15 hover:border-brand-gold/40'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-brand-gold border border-brand-gold/20">
                    {dars.regNo}
                  </span>
                  {dars.district && (
                    <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-teal" />
                      {dars.district}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white leading-tight">
                    {language === 'ml' ? dars.nameMl : dars.nameEn}
                  </h3>
                  <span className="font-arabic text-xs text-neutral-500 dark:text-neutral-400 block mt-0.5">
                    {dars.nameMl}
                  </span>
                </div>

                <div className="pt-2 border-t border-brand-gold/10">
                  <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">
                    Mudarris
                  </span>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-200 mt-0.5">
                    {dars.mudarris}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-brand-gold/10 flex items-center justify-between text-xs">
                <a
                  href={`tel:${dars.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-hover font-mono text-[11px]"
                >
                  <Phone className="w-3 h-3" />
                  <span>{dars.phone}</span>
                </a>
                <span className="text-[10px] text-neutral-400">Verified</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-12 rounded-2xl glass-panel border border-brand-gold/20 text-neutral-500 text-sm">
          No matching Dars found for &ldquo;{searchQuery}&rdquo;. Try another name or registration code.
        </div>
      )}
    </section>
  );
}
