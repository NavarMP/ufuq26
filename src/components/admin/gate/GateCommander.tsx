'use client';

import React, { useState } from 'react';
import { Registration, SuffaDars } from '@/types';
import { useGateOperations } from '@/hooks/useGateOperations';
import GateScannerHUD from '@/components/scanner/GateScannerHUD';
import PlasticCardBadge from '@/components/badge/PlasticCardBadge';
import { getActiveMealSlot } from '@/lib/mealSlots';
import {
  Camera,
  DoorOpen,
  UtensilsCrossed,
  BookOpen,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Search,
  Printer,
  X,
  Sparkles,
  Building2,
  RefreshCw,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';

interface GateCommanderProps {
  registrations: Registration[];
  darsList: SuffaDars[];
}

export default function GateCommander({ registrations, darsList }: GateCommanderProps) {
  const { scanLogs, stats, processScan, exportGateLogsCSV } = useGateOperations();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedBadgeReg, setSelectedBadgeReg] = useState<Registration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeMeal = getActiveMealSlot();

  // Search filtered attendees for quick manual check-in
  const filteredAttendees = searchQuery.trim()
    ? registrations.filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
          r.fullName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          (r.regCode || '').toLowerCase().includes(q) ||
          (r.darsRegNo || '').toLowerCase().includes(q) ||
          (r.darsName || '').toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header & Launch Scanner CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-brand-gold/30 bg-gradient-to-r from-brand-navy/90 via-slate-900/90 to-brand-navy/90 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-brand-gold uppercase">
              Operations Center
            </span>
          </div>
          <h2 className="font-clash text-2xl sm:text-3xl font-bold tracking-tight">
            Gate &amp; Attendance Command Center
          </h2>
          <p className="text-xs text-neutral-300">
            Real-time campus headcount, optical smartphone scanner, dining hall tokens, and session logs.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={exportGateLogsCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl glass-panel text-xs font-semibold text-neutral-200 hover:border-brand-gold transition-colors"
          >
            <Download className="w-4 h-4 text-brand-gold" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-xs sm:text-sm shadow-xl shadow-brand-gold/25 transition-transform hover:scale-105 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Launch Smartphone Scanner</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Currently Inside Campus */}
        <div className="p-5 rounded-3xl glass-panel border border-emerald-500/30 bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Inside Campus</span>
            <DoorOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-3xl sm:text-4xl font-black text-emerald-400">
              {stats.insideCount}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              / {stats.totalAttendees} ({stats.occupancyPercentage}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${stats.occupancyPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Outside Venue */}
        <div className="p-5 rounded-3xl glass-panel border border-amber-500/30 bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Outside Venue</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-3xl sm:text-4xl font-black text-amber-400">
              {stats.outsideCount}
            </span>
            <span className="text-xs text-neutral-400 font-mono">Pending arrival</span>
          </div>
          <p className="text-[11px] text-neutral-400">Active credentials issued</p>
        </div>

        {/* Card 3: Today's Gate Scans */}
        <div className="p-5 rounded-3xl glass-panel border border-brand-gold/30 bg-brand-gold/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Today&apos;s Scans</span>
            <RefreshCw className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-3xl sm:text-4xl font-black text-brand-gold">
              {stats.todayScans}
            </span>
            <span className="text-xs text-neutral-400 font-mono">Total movements</span>
          </div>
          <p className="text-[11px] text-neutral-400">Entries &amp; exits recorded</p>
        </div>

        {/* Card 4: Meals Claimed */}
        <div className="p-5 rounded-3xl glass-panel border border-indigo-500/30 bg-indigo-950/20 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Meals Claimed</span>
            <UtensilsCrossed className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-3xl sm:text-4xl font-black text-indigo-400">
              {stats.totalMealsClaimed}
            </span>
            <span className="text-xs text-neutral-400 font-mono">Vouchers</span>
          </div>
          <p className="text-[11px] text-neutral-400 truncate">
            Current: {activeMeal.label.split('-')[1]?.trim() || activeMeal.label}
          </p>
        </div>
      </div>

      {/* Main Grid: Live Scan Feed + Manual Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Scan Activity Ticker */}
        <div className="lg:col-span-2 rounded-3xl glass-panel border border-brand-gold/25 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              <h3 className="font-clash text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Live Scan Activity Stream
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              {scanLogs.length} Records Logged
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {scanLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white/50 dark:bg-black/30 border border-brand-gold/15 hover:border-brand-gold/40 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Indicator Circle */}
                  <div className="shrink-0">
                    {log.resultStatus === 'granted' ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : log.resultStatus === 'warning' ? (
                      <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center">
                        <XCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-neutral-900 dark:text-white truncate">
                        {log.attendeeName}
                      </span>
                      <span className="font-mono text-[10px] text-brand-gold font-bold">
                        {log.regCode}
                      </span>
                      {log.darsRegNo && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-mono text-neutral-500">
                          {log.darsRegNo}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {log.message}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right space-y-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider ${
                      log.checkpoint === 'main_gate'
                        ? log.direction === 'in'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                        : log.checkpoint === 'dining_hall'
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {log.checkpoint.replace(/_/g, ' ')} {log.direction.toUpperCase()}
                  </span>
                  <p className="font-mono text-[10px] text-neutral-400">
                    {new Date(log.scannedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {scanLogs.length === 0 && (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <DoorOpen className="w-8 h-8 text-neutral-500 mx-auto" />
                <p>No scans recorded yet today.</p>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-all"
                >
                  Start First Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Lookup & Manual Check-in Override */}
        <div className="rounded-3xl glass-panel border border-brand-gold/25 p-5 sm:p-6 space-y-4">
          <div className="border-b border-brand-gold/15 pb-3">
            <h3 className="font-clash text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-gold" />
              <span>Manual Check-in Override</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Search by name, phone, or Dars if badge is damaged or unreadable.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholar name or phone..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/30 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>

          {/* Search Results */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto">
            {filteredAttendees.map((att) => {
              const isInside = att.gateStatus === 'inside';
              return (
                <div
                  key={att.id}
                  className="p-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/20 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">
                        {att.fullName}
                      </h4>
                      <p className="font-mono text-[10px] text-brand-gold font-bold">
                        {att.regCode || att.id}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {att.darsName}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                        isInside
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-amber-500/20 text-amber-500'
                      }`}
                    >
                      {isInside ? 'INSIDE' : 'OUTSIDE'}
                    </span>
                  </div>

                  {/* Actions for found scholar */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-brand-gold/15">
                    <button
                      type="button"
                      onClick={() =>
                        processScan({
                          registration: att,
                          checkpoint: 'main_gate',
                          direction: isInside ? 'out' : 'in',
                        })
                      }
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-brand-gold text-brand-navy font-bold text-[10px] shadow hover:bg-brand-gold-hover transition-colors flex items-center justify-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Mark {isInside ? 'OUT' : 'IN'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        processScan({
                          registration: att,
                          checkpoint: 'dining_hall',
                          direction: 'in',
                          sessionContext: activeMeal.id,
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 transition-colors flex items-center gap-1"
                      title="Redeem current meal"
                    >
                      <UtensilsCrossed className="w-3 h-3" />
                      <span>Meal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBadgeReg(att)}
                      className="p-1.5 rounded-lg border border-brand-gold/30 hover:border-brand-gold text-neutral-600 dark:text-neutral-300"
                      title="View & Print Plastic Card Badge"
                    >
                      <Printer className="w-3.5 h-3.5 text-brand-gold" />
                    </button>
                  </div>
                </div>
              );
            })}

            {searchQuery.trim() && filteredAttendees.length === 0 && (
              <p className="text-center text-neutral-400 py-6 text-xs">
                No attendee found matching &ldquo;{searchQuery}&rdquo;.
              </p>
            )}

            {!searchQuery.trim() && (
              <div className="text-center text-neutral-400 py-8 space-y-1">
                <Search className="w-6 h-6 text-neutral-500 mx-auto" />
                <p className="text-xs">Type a name, phone, or code above.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL 1: SMARTPHONE CAMERA SCANNER HUD
         ======================================================== */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg my-8">
            <GateScannerHUD
              registrations={registrations}
              onProcessScan={processScan}
              onClose={() => setIsScannerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: SINGLE ATTENDEE PLASTIC CARD BADGE MODAL
         ======================================================== */}
      {selectedBadgeReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-brand-gold/20">
              <span className="font-clash text-lg font-bold text-white">
                Plastic Card Preview
              </span>
              <button
                type="button"
                onClick={() => setSelectedBadgeReg(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PlasticCardBadge
              registration={selectedBadgeReg}
              orientation="portrait"
              showControls={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
