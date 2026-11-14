'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { Registration, ScheduleSession } from '@/types';

type TimeRange = '7d' | '14d' | '30d' | 'all';

const CHART_WIDTH = 600;
const CHART_HEIGHT = 200;
const CHART_PADDING = { top: 20, right: 30, bottom: 30, left: 30 };

interface DashboardAnalyticsSuiteProps {
  registrations: Registration[];
  schedule: ScheduleSession[];
  onSelectStatus?: (status: string) => void;
}

export default function DashboardAnalyticsSuite({
  registrations,
  schedule,
  onSelectStatus,
}: DashboardAnalyticsSuiteProps) {
  // Default timeframe: 'all' as requested by the user
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    daily: number;
    cumulative: number;
    x: number;
    y: number;
  } | null>(null);

  // Time-series aggregation
  const timeSeriesData = useMemo(() => {
    if (registrations.length === 0) return [];

    // Parse all dates
    const parsed = registrations
      .map((r) => {
        const d = new Date(r.submittedAt);
        return isNaN(d.getTime()) ? new Date() : d;
      })
      .sort((a, b) => a.getTime() - b.getTime());

    const now = new Date();
    let cutoff = new Date(0);

    if (timeRange === '7d') {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '14d') {
      cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '30d') {
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Group counts by day format YYYY-MM-DD
    const dayMap = new Map<string, number>();

    // If a cutoff is set, pre-fill days up to today
    if (timeRange !== 'all') {
      const daysCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split('T')[0];
        dayMap.set(key, 0);
      }
    }

    parsed.forEach((d) => {
      if (d >= cutoff) {
        const key = d.toISOString().split('T')[0];
        dayMap.set(key, (dayMap.get(key) || 0) + 1);
      }
    });

    const entries = Array.from(dayMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    let runningTotal = 0;

    return entries.map(([date, count]) => {
      runningTotal += count;
      return {
        date,
        daily: count,
        cumulative: runningTotal,
      };
    });
  }, [registrations, timeRange]);

  const graphPoints = useMemo(() => {
    if (timeSeriesData.length <= 1) return [];

    const maxVal = Math.max(...timeSeriesData.map((d) => d.cumulative), 5);
    const usableWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
    const usableHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

    return timeSeriesData.map((item, index) => {
      const x = CHART_PADDING.left + (index / (timeSeriesData.length - 1)) * usableWidth;
      const y = CHART_HEIGHT - CHART_PADDING.bottom - (item.cumulative / maxVal) * usableHeight;
      return { ...item, x, y };
    });
  }, [timeSeriesData]);

  // Generate SVG path string with smooth Bézier interpolation
  const linePath = useMemo(() => {
    if (graphPoints.length === 0) return '';
    if (graphPoints.length === 1) {
      return `M ${graphPoints[0].x} ${graphPoints[0].y}`;
    }

    let d = `M ${graphPoints[0].x} ${graphPoints[0].y}`;
    for (let i = 0; i < graphPoints.length - 1; i++) {
      const curr = graphPoints[i];
      const next = graphPoints[i + 1];
      const cpX = (curr.x + next.x) / 2;
      d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [graphPoints]);

  const areaPath = useMemo(() => {
    if (graphPoints.length === 0 || !linePath) return '';
    const last = graphPoints[graphPoints.length - 1];
    const first = graphPoints[0];
    const baselineY = CHART_HEIGHT - CHART_PADDING.bottom;
    return `${linePath} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
  }, [graphPoints, linePath]);

  // Status breakdown metrics
  const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
  const pending = registrations.filter((r) => r.status === 'pending').length;
  const cancelled = registrations.filter((r) => r.status === 'cancelled').length;
  const total = Math.max(1, registrations.length);

  // Category breakdown
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    schedule.forEach((s) => {
      const cat = s.category || 'Academics';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [schedule]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* 1. Time-series Registration Velocity Graph (Span 2 cols on wide) */}
      <div className="lg:col-span-2 p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-4 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-clash font-bold text-base text-neutral-900 dark:text-white">
                Registration Velocity &amp; Growth Trajectory
              </h3>
              <p className="text-[11px] text-neutral-500">
                Daily and cumulative candidate admissions over time
              </p>
            </div>
          </div>

          {/* Time range selector pills */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 self-start sm:self-auto">
            {(['7d', '14d', '30d', 'all'] as TimeRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setTimeRange(r);
                  setHoveredPoint(null);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all ${
                  timeRange === r
                    ? 'bg-brand-gold text-brand-navy shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Time' : r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Interactive Velocity Graph */}
        <div className="relative w-full h-56 pt-2 select-none">
          {graphPoints.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-brand-gold/40 mb-2" />
              <span>Awaiting registration submissions to chart velocity curve.</span>
            </div>
          ) : (
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a45c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#c9a45c" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = CHART_PADDING.top + pct * (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom);
                return (
                  <line
                    key={idx}
                    x1={CHART_PADDING.left}
                    y1={y}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-black/5 dark:text-white/5"
                  />
                );
              })}

              {/* Gradient Area Fill */}
              {areaPath && (
                <path d={areaPath} fill="url(#areaGradient)" />
              )}

              {/* Smooth Bézier Velocity Curve */}
              {linePath && (
                <motion.path
                  d={linePath}
                  fill="transparent"
                  stroke="#c9a45c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Interactive Data Nodes */}
              {graphPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.date === pt.date ? 6 : 3.5}
                    className="fill-brand-navy stroke-brand-gold stroke-2 transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                  />
                </g>
              ))}

              {/* Hover Vertical Guide Line */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={CHART_PADDING.top}
                  x2={hoveredPoint.x}
                  y2={CHART_HEIGHT - CHART_PADDING.bottom}
                  stroke="#c9a45c"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="pointer-events-none"
                />
              )}
            </svg>
          )}

          {/* Floating Glass Tooltip */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                style={{
                  left: `${(hoveredPoint.x / CHART_WIDTH) * 100}%`,
                  top: `${(hoveredPoint.y / CHART_HEIGHT) * 100 - 30}%`,
                }}
                className="absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none"
              >
                <div className="px-3 py-1.5 rounded-xl glass-panel bg-brand-navy/95 text-white border border-brand-gold/40 shadow-xl text-center whitespace-nowrap text-[11px] font-mono">
                  <div className="text-[10px] text-neutral-400">
                    {new Date(hoveredPoint.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-brand-gold font-bold">
                    +{hoveredPoint.daily} submission{hoveredPoint.daily === 1 ? '' : 's'}
                  </div>
                  <div className="text-[10px] text-neutral-300">
                    Total: {hoveredPoint.cumulative}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Legend */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-brand-gold/10">
          <span>Timeline trajectory ({timeSeriesData.length} active date points)</span>
          <span className="text-brand-gold font-bold">● Active Real-time Firestore Plot</span>
        </div>
      </div>

      {/* 2. Status Breakdown & Schedule Distribution (1 col) */}
      <div className="space-y-6">
        {/* Status Breakdown Card */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-clash font-bold text-base text-neutral-900 dark:text-white">
                Application Status Distribution
              </h3>
              <p className="text-[11px] text-neutral-500">
                Review and admissions ratio
              </p>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex">
            <div
              style={{ width: `${(confirmed / total) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Confirmed: ${confirmed}`}
            />
            <div
              style={{ width: `${(pending / total) * 100}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Pending: ${pending}`}
            />
            <div
              style={{ width: `${(cancelled / total) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Cancelled: ${cancelled}`}
            />
          </div>

          {/* Interactive Status Items */}
          <div className="space-y-2 pt-1">
            <div
              onClick={() => onSelectStatus?.('confirmed')}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Confirmed Candidates
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {confirmed}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({Math.round((confirmed / total) * 100)}%)
                </span>
              </div>
            </div>

            <div
              onClick={() => onSelectStatus?.('pending')}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Pending Applications
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {pending}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({Math.round((pending / total) * 100)}%)
                </span>
              </div>
            </div>

            <div
              onClick={() => onSelectStatus?.('cancelled')}
              className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between cursor-pointer hover:border-rose-500/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Cancelled / Declined
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {cancelled}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({Math.round((cancelled / total) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Category Distribution */}
        <div className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-clash font-bold text-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-gold" />
              <span>Program Track Density ({schedule.length} sessions)</span>
            </h4>
            <span className="text-[10px] font-mono text-neutral-400">7-Day Matrix</span>
          </div>

          <div className="space-y-2">
            {categoryCounts.map(([cat, count]) => (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                    {cat}
                  </span>
                  <span className="font-mono text-neutral-400">
                    {count} session{count === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                  <div
                    style={{ width: `${(count / Math.max(1, schedule.length)) * 100}%` }}
                    className="h-full bg-brand-gold rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
