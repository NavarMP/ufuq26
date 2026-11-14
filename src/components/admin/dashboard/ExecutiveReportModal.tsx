'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Registration, ScheduleSession, Guest, DarsAccount, EventInfo } from '@/types';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  schedule: ScheduleSession[];
  guests: Guest[];
  darsAccounts: DarsAccount[];
  eventInfo: EventInfo;
}

export default function ExecutiveReportModal({
  isOpen,
  onClose,
  registrations,
  schedule,
  guests,
  darsAccounts,
  eventInfo,
}: ExecutiveReportModalProps) {
  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;
  const targetCapacity = eventInfo.maxParticipants && eventInfo.maxParticipants > 0
    ? eventInfo.maxParticipants
    : 150;
  const occupancyPercentage = Math.round((confirmedCount / targetCapacity) * 100);

  // Group registrations by dars
  const topDars = useMemo(() => {
    const map = new Map<string, { name: string; count: number; confirmed: number }>();
    registrations.forEach((r) => {
      const name = r.darsName || r.darsRegNo || 'Direct Application';
      if (!map.has(name)) {
        map.set(name, { name, count: 0, confirmed: 0 });
      }
      const item = map.get(name)!;
      item.count += 1;
      if (r.status === 'confirmed') item.confirmed += 1;
    });
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [registrations]);

  const printTimestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel bg-neutral-900 border border-brand-gold/30 shadow-2xl text-white print:bg-white print:text-black print:max-h-none print:shadow-none print:border-none print:m-0 print:p-0"
        >
          {/* Action Bar (hidden when printing) */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 px-6 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span className="font-clash font-bold text-sm">
                Executive Status Report Preview
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Report Document Body */}
          <div className="p-8 sm:p-12 space-y-8 print:p-0 print:space-y-6">
            {/* Document Header */}
            <div className="border-b border-brand-gold/30 pb-6 print:border-neutral-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-mono font-bold mb-2 print:bg-neutral-100 print:text-black">
                    OFFICIAL STATUS DOSSIER
                  </div>
                  <h1 className="font-clash text-2xl sm:text-3xl font-extrabold tracking-tight">
                    UFUQ ’26 Executive Briefing
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 print:text-neutral-600 mt-1">
                    7-Day Academic Residency & SUFFA Dars Delegates Assembly
                  </p>
                  <p className="text-xs text-neutral-400 print:text-neutral-600">
                    Alathurpadi Dars Students Association (ADSA) • Darsul Huda Campus
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs font-mono text-neutral-400 print:text-neutral-600">
                  <div className="font-bold text-brand-gold print:text-black">
                    DEC 24 – 30, 2026
                  </div>
                  <div className="text-[11px] mt-1">Generated: {printTimestamp}</div>
                  <div className="text-[10px] text-neutral-500">Confidential / Internal Use</div>
                </div>
              </div>
            </div>

            {/* Executive KPI Summary Table */}
            <div className="space-y-3">
              <h2 className="font-clash font-bold text-sm uppercase tracking-wider text-brand-gold print:text-black">
                1. Core Residency Metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 print:border-neutral-300 print:bg-neutral-50">
                  <span className="text-[10px] font-mono text-neutral-400 print:text-neutral-600 block">
                    TOTAL APPLICANTS
                  </span>
                  <span className="font-clash font-extrabold text-2xl text-white print:text-black block mt-1">
                    {registrations.length}
                  </span>
                  <span className="text-[11px] text-neutral-400 print:text-neutral-600">
                    {confirmedCount} confirmed • {pendingCount} pending
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 print:border-neutral-300 print:bg-neutral-50">
                  <span className="text-[10px] font-mono text-neutral-400 print:text-neutral-600 block">
                    TARGET CAPACITY
                  </span>
                  <span className="font-clash font-extrabold text-2xl text-brand-gold print:text-black block mt-1">
                    {targetCapacity}
                  </span>
                  <span className="text-[11px] text-emerald-400 print:text-neutral-600">
                    {occupancyPercentage}% Occupancy
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 print:border-neutral-300 print:bg-neutral-50">
                  <span className="text-[10px] font-mono text-neutral-400 print:text-neutral-600 block">
                    SUFFA DARS NETWORK
                  </span>
                  <span className="font-clash font-extrabold text-2xl text-white print:text-black block mt-1">
                    {darsAccounts.length}
                  </span>
                  <span className="text-[11px] text-neutral-400 print:text-neutral-600">
                    Seeded Coordinators
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 print:border-neutral-300 print:bg-neutral-50">
                  <span className="text-[10px] font-mono text-neutral-400 print:text-neutral-600 block">
                    ACADEMIC SESSIONS
                  </span>
                  <span className="font-clash font-extrabold text-2xl text-white print:text-black block mt-1">
                    {schedule.length}
                  </span>
                  <span className="text-[11px] text-neutral-400 print:text-neutral-600">
                    {guests.length} Dignitaries
                  </span>
                </div>
              </div>
            </div>

            {/* Institutional Participation Section */}
            <div className="space-y-3">
              <h2 className="font-clash font-bold text-sm uppercase tracking-wider text-brand-gold print:text-black">
                2. Institutional Participation (Top Dars Centers)
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-white/10 print:border-neutral-300">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5 text-neutral-400 uppercase font-mono text-[10px] print:bg-neutral-100 print:text-neutral-700">
                    <tr>
                      <th className="py-2.5 px-4"># Rank</th>
                      <th className="py-2.5 px-4">SUFFA Dars Institution</th>
                      <th className="py-2.5 px-4 text-center">Total Candidates</th>
                      <th className="py-2.5 px-4 text-center">Confirmed</th>
                      <th className="py-2.5 px-4 text-right">Confirmation Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 print:divide-neutral-200">
                    {topDars.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-neutral-500">
                          No institutional registrations recorded yet.
                        </td>
                      </tr>
                    ) : (
                      topDars.map((item, idx) => {
                        const rate = item.count > 0 ? Math.round((item.confirmed / item.count) * 100) : 0;
                        return (
                          <tr key={item.name} className="print:text-black">
                            <td className="py-2.5 px-4 font-mono font-bold text-brand-gold print:text-black">
                              #{idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-semibold">{item.name}</td>
                            <td className="py-2.5 px-4 text-center font-mono">{item.count}</td>
                            <td className="py-2.5 px-4 text-center font-mono text-emerald-400 print:text-black font-bold">
                              {item.confirmed}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono">{rate}%</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Academic Residency Schedule Synopsis */}
            <div className="space-y-3">
              <h2 className="font-clash font-bold text-sm uppercase tracking-wider text-brand-gold print:text-black">
                3. Academic Itinerary & Residency Schedule
              </h2>
              <p className="text-xs text-neutral-400 print:text-neutral-600">
                7 Days of rigorous academic lectures, Quranic contemplation, leadership summits, and cultural evenings scheduled from Dec 24 through Dec 30, 2026.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-xs">
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                  const daySessions = schedule.filter((s) => s.day === dayNum);
                  return (
                    <div
                      key={dayNum}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 print:border-neutral-300 print:bg-neutral-50"
                    >
                      <span className="font-clash font-bold block text-brand-gold print:text-black">
                        Day {dayNum}
                      </span>
                      <span className="font-mono text-xs block mt-1 font-bold">
                        {daySessions.length} Sessions
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leadership Sign-off Block */}
            <div className="pt-8 border-t border-brand-gold/30 print:border-neutral-300">
              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                <div className="space-y-8">
                  <div className="h-10 border-b border-dashed border-white/30 print:border-neutral-400" />
                  <div>
                    <span className="font-bold block text-neutral-200 print:text-black">
                      General Convener
                    </span>
                    <span className="text-[10px] text-neutral-400 print:text-neutral-600">
                      UFUQ ’26 Organizing Committee
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="h-10 border-b border-dashed border-white/30 print:border-neutral-400" />
                  <div>
                    <span className="font-bold block text-neutral-200 print:text-black">
                      Academic Director
                    </span>
                    <span className="text-[10px] text-neutral-400 print:text-neutral-600">
                      Curriculum & Delegates Wing
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="h-10 border-b border-dashed border-white/30 print:border-neutral-400" />
                  <div>
                    <span className="font-bold block text-neutral-200 print:text-black">
                      President / Patron
                    </span>
                    <span className="text-[10px] text-neutral-400 print:text-neutral-600">
                      ADSA Alathurpadi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
