'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  MapPin,
  MessageCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Registration, DarsAccount } from '@/types';
import { AdminTab } from '../layout/AdminSidebar';

interface DashboardInstitutionalRankProps {
  registrations: Registration[];
  darsAccounts: DarsAccount[];
  onSelectTab: (tab: AdminTab) => void;
}

export default function DashboardInstitutionalRank({
  registrations,
  darsAccounts,
  onSelectTab,
}: DashboardInstitutionalRankProps) {
  const [activeView, setActiveView] = useState<'ranking' | 'districts'>('ranking');

  // Compute Dars rankings based on registrations
  const darsRanking = useMemo(() => {
    // Map Dars ID / RegNo to count and details
    const countMap = new Map<string, {
      id: string;
      regNo: string;
      nameEn: string;
      nameMl?: string;
      mudarris: string;
      phone: string;
      district: string;
      applicantCount: number;
      confirmedCount: number;
    }>();

    // Initialize map with known darsAccounts
    darsAccounts.forEach((account) => {
      countMap.set(account.regNo, {
        id: account.id,
        regNo: account.regNo,
        nameEn: account.darsNameEn,
        nameMl: account.darsNameMl,
        mudarris: account.mudarris,
        phone: account.phone,
        district: 'Malappuram', // default fallback
        applicantCount: 0,
        confirmedCount: 0,
      });
    });

    // Tally registrations
    registrations.forEach((reg) => {
      const key = reg.darsRegNo || reg.darsId;
      if (key && countMap.has(key)) {
        const entry = countMap.get(key)!;
        entry.applicantCount += 1;
        if (reg.status === 'confirmed') entry.confirmedCount += 1;
        if (reg.darsDistrict) entry.district = reg.darsDistrict;
      } else if (reg.darsName) {
        // Find by name if regNo not directly matching
        const match = Array.from(countMap.values()).find(
          (a) => a.nameEn.toLowerCase() === reg.darsName?.toLowerCase()
        );
        if (match) {
          match.applicantCount += 1;
          if (reg.status === 'confirmed') match.confirmedCount += 1;
          if (reg.darsDistrict) match.district = reg.darsDistrict;
        } else if (key) {
          // Unknown custom dars
          countMap.set(key, {
            id: key,
            regNo: key,
            nameEn: reg.darsName || key,
            mudarris: reg.darsMudarris || 'Mudarris',
            phone: '',
            district: reg.darsDistrict || 'General',
            applicantCount: 1,
            confirmedCount: reg.status === 'confirmed' ? 1 : 0,
          });
        }
      }
    });

    // Sort descending by applicant count, then confirmed count
    return Array.from(countMap.values())
      .filter((d) => d.applicantCount > 0)
      .sort((a, b) => b.applicantCount - a.applicantCount || b.confirmedCount - a.confirmedCount);
  }, [registrations, darsAccounts]);

  // Compute District breakdown
  const districtDistribution = useMemo(() => {
    const districtMap = new Map<string, number>();

    registrations.forEach((r) => {
      const district = r.darsDistrict || 'Malappuram';
      districtMap.set(district, (districtMap.get(district) || 0) + 1);
    });

    const total = registrations.length || 1;
    return Array.from(districtMap.entries())
      .map(([district, count]) => ({
        district,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [registrations]);

  const topInstitutions = darsRanking.slice(0, 5);
  const maxApplicantCount = topInstitutions[0]?.applicantCount || 1;

  const handleWhatsApp = (phone: string, mudarris: string, darsName: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Assalamu Alaikum Respected ${mudarris} Usthad,\nRegarding UFUQ '26 7-Day Residency delegates from ${darsName}...`
    );
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-clash font-bold text-lg text-neutral-900 dark:text-white">
                Institutional Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-mono text-[10px] font-bold">
                {darsAccounts.length} Hubs
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              SUFFA Dars enrollment distribution & district analytics
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('ranking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'ranking'
                ? 'bg-brand-gold text-brand-navy shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Top Centers ({topInstitutions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('districts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'districts'
                ? 'bg-brand-gold text-brand-navy shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Districts ({districtDistribution.length})
          </button>
        </div>
      </div>

      {/* View Content */}
      {activeView === 'ranking' ? (
        <div className="space-y-3">
          {topInstitutions.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-2xl">
              No institution applications registered yet. Once delegates apply from SUFFA Dars centers, real-time rankings will show here.
            </div>
          ) : (
            topInstitutions.map((item, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              return (
                <motion.div
                  key={item.regNo}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 hover:border-brand-gold/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-clash font-extrabold text-xs shrink-0 ${
                        isFirst
                          ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-brand-navy shadow-md'
                          : isSecond
                          ? 'bg-gradient-to-br from-neutral-200 to-neutral-400 text-neutral-800'
                          : isThird
                          ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                          : 'bg-black/10 dark:bg-white/10 text-neutral-500 font-mono'
                      }`}
                    >
                      {isFirst ? <Award className="w-4 h-4" /> : `#${index + 1}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-brand-gold">
                          {item.regNo}
                        </span>
                        <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                          {item.nameEn}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-0.5">
                        <span className="truncate">{item.mudarris}</span>
                        {item.district && (
                          <span className="flex items-center gap-0.5 shrink-0 text-neutral-400">
                            <MapPin className="w-3 h-3" />
                            {item.district}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-gold/10">
                    {/* Visual bar meter */}
                    <div className="hidden md:flex flex-col items-end w-28">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {item.applicantCount}
                        </span>
                        <span className="text-neutral-400">apps</span>
                        <span className="text-emerald-500 font-bold">({item.confirmedCount} ok)</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-brand-gold rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round((item.applicantCount / maxApplicantCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Applicant Pill */}
                    <div className="md:hidden px-2.5 py-1 rounded-xl bg-brand-gold/15 text-brand-gold font-mono text-xs font-bold">
                      {item.applicantCount} apps ({item.confirmedCount} confirmed)
                    </div>

                    {/* WhatsApp Action */}
                    {item.phone && (
                      <button
                        type="button"
                        onClick={() => handleWhatsApp(item.phone, item.mudarris, item.nameEn)}
                        title={`WhatsApp Usthad ${item.mudarris}`}
                        className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        /* District Spread View */
        <div className="space-y-3">
          {districtDistribution.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-2xl">
              No district records registered.
            </div>
          ) : (
            districtDistribution.map((item, idx) => (
              <div
                key={item.district}
                className="p-3.5 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    {item.district}
                  </span>
                  <span className="font-mono text-neutral-500">
                    <strong className="text-brand-gold">{item.count}</strong> applicants ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-teal rounded-full"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer link to Dars Manager */}
      <div className="pt-2 border-t border-brand-gold/15 flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          Showing data across all 39 affiliated SUFFA Dars institutions
        </span>
        <button
          type="button"
          onClick={() => onSelectTab('dars')}
          className="text-brand-gold hover:underline font-bold flex items-center gap-1"
        >
          <span>Manage All Dars Hubs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
