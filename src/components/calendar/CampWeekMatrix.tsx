'use client';

import React from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { Clock, Tag, UserCheck, CalendarPlus, Bell } from 'lucide-react';
import { ScheduleSession } from '@/types';

interface CampWeekMatrixProps {
  onSelectSession: (session: ScheduleSession) => void;
  onAddSessionToCalendar: (session: ScheduleSession) => void;
  onSetSessionReminder: (session: ScheduleSession) => void;
}

export default function CampWeekMatrix({
  onSelectSession,
  onAddSessionToCalendar,
  onSetSessionReminder,
}: CampWeekMatrixProps) {
  const { schedule, guests } = useEvent();
  const { language } = useApp();

  const days = [
    { day: 1, date: 'Dec 24', label: 'Day 1: Inception' },
    { day: 2, date: 'Dec 25', label: 'Day 2: Academics' },
    { day: 3, date: 'Dec 26', label: 'Day 3: Intellectual' },
    { day: 4, date: 'Dec 27', label: 'Day 4: Workshops' },
    { day: 5, date: 'Dec 28', label: 'Day 5: Guidance' },
    { day: 6, date: 'Dec 29', label: 'Day 6: Mentorship' },
    { day: 7, date: 'Dec 30', label: 'Day 7: Valedictory' },
  ];

  const getGuestName = (speakerId?: string) => {
    if (!speakerId) return null;
    const g = guests.find((item) => item.id === speakerId);
    return g ? resolveLocalized(g.name, language) : null;
  };

  return (
    <div className="w-full space-y-6">
      <div className="overflow-x-auto pb-4 no-scrollbar">
        <div className="min-w-[850px] grid grid-cols-7 gap-3">
          {days.map((d) => {
            const daySessions = schedule
              .filter((s) => s.day === d.day && s.published)
              .sort((a, b) => a.order - b.order);

            return (
              <div
                key={d.day}
                className="flex flex-col rounded-3xl glass-panel border border-brand-gold/25 p-3.5 bg-brand-gold/5"
              >
                {/* Day Header */}
                <div className="pb-3 border-b border-brand-gold/20 mb-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-gold text-brand-navy shadow-sm inline-block">
                    Day {d.day}
                  </span>
                  <h4 className="font-clash font-bold text-xs text-brand-navy dark:text-brand-gold-light mt-1.5 truncate">
                    {d.date}
                  </h4>
                  <span className="text-[10px] text-neutral-500 truncate block">
                    {d.label.split(':')[1]}
                  </span>
                </div>

                {/* Session list for the day */}
                <div className="space-y-2.5 flex-1">
                  {daySessions.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-neutral-400">
                      Sessions being finalized
                    </div>
                  ) : (
                    daySessions.map((session) => {
                      const speakerName = getGuestName(session.speaker);

                      return (
                        <div
                          key={session.id}
                          className="p-2.5 rounded-2xl glass-panel border border-white/10 hover:border-brand-gold/50 bg-black/5 dark:bg-white/5 transition-all text-left rtl:text-right group"
                        >
                          {/* Timing */}
                          <div className="flex items-center gap-1 text-[10px] font-mono text-brand-teal dark:text-emerald-400">
                            <Clock className="w-3 h-3" />
                            <span>{session.startTime} – {session.endTime}</span>
                          </div>

                          {/* Title */}
                          <h5 className="font-clash font-bold text-xs text-brand-navy dark:text-white mt-1 group-hover:text-brand-gold line-clamp-2 transition-colors">
                            {resolveLocalized(session.title, language)}
                          </h5>

                          {/* Category Badge */}
                          {session.category && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-semibold bg-brand-gold/15 text-brand-gold">
                              {session.category}
                            </span>
                          )}

                          {/* Speaker */}
                          {speakerName && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-neutral-400">
                              <UserCheck className="w-3 h-3 text-brand-gold" />
                              <span className="truncate">{speakerName}</span>
                            </div>
                          )}

                          {/* Quick Action buttons */}
                          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                            <button
                              onClick={() => onAddSessionToCalendar(session)}
                              className="p-1 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                              title="Add session to calendar"
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSetSessionReminder(session)}
                              className="p-1 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                              title="Set reminder for session"
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onSelectSession(session)}
                              className="text-[10px] font-semibold text-brand-gold hover:underline"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
