'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { ScheduleSession } from '@/types';

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSession: ScheduleSession | null;
  totalSessionsCount: number;
  onSave: (session: Omit<ScheduleSession, 'id'>) => Promise<void>;
}

export default function SessionFormModal({
  isOpen,
  onClose,
  editingSession,
  totalSessionsCount,
  onSave,
}: SessionFormModalProps) {
  const [form, setForm] = useState({
    day: 1,
    date: '2026-12-24',
    startTime: '09:00',
    endTime: '11:00',
    titleEn: '',
    titleMl: '',
    titleAr: '',
    descEn: '',
    category: 'Academics',
    published: true,
    order: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSession) {
      setForm({
        day: editingSession.day,
        date: editingSession.date,
        startTime: editingSession.startTime,
        endTime: editingSession.endTime,
        titleEn: editingSession.title.en,
        titleMl: editingSession.title.ml || '',
        titleAr: editingSession.title.ar || '',
        descEn: editingSession.description?.en || '',
        category: editingSession.category || 'Academics',
        published: editingSession.published,
        order: editingSession.order,
      });
    } else {
      setForm({
        day: 1,
        date: '2026-12-24',
        startTime: '09:00',
        endTime: '11:00',
        titleEn: '',
        titleMl: '',
        titleAr: '',
        descEn: '',
        category: 'Academics',
        published: true,
        order: totalSessionsCount + 1,
      });
    }
  }, [editingSession, totalSessionsCount, isOpen]);

  // Adjust date based on chosen day
  const handleDayChange = (dayNum: number) => {
    // Event starts Dec 24, 2026
    const baseDate = 24;
    const computedDate = `2026-12-${String(baseDate + dayNum - 1).padStart(2, '0')}`;
    setForm((prev) => ({
      ...prev,
      day: dayNum,
      date: computedDate,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleEn.trim()) {
      alert('Session title in English is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        day: Number(form.day),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        title: {
          en: form.titleEn.trim(),
          ml: form.titleMl.trim() || undefined,
          ar: form.titleAr.trim() || undefined,
        },
        description: form.descEn.trim() ? { en: form.descEn.trim() } : undefined,
        category: form.category.trim() || 'Academics',
        published: form.published,
        order: Number(form.order),
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl glass-panel bg-white/95 dark:bg-[#0c1220]/95 border border-brand-gold/30 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
                    {editingSession ? 'Edit Timetable Session' : 'Add New Schedule Session'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    7-Day academic residency timetable curation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Residency Day (1–7) *
                  </label>
                  <select
                    value={form.day}
                    onChange={(e) => handleDayChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>
                        Day {d} (Dec {23 + d}, 2026)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Session Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  placeholder="e.g. Higher Academic Pathways in Central Universities"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Title (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={form.titleMl}
                    onChange={(e) => setForm({ ...form, titleMl: e.target.value })}
                    placeholder="മലയാളം തലക്കെട്ട്"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Title (Arabic)
                  </label>
                  <input
                    type="text"
                    value={form.titleAr}
                    onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                    placeholder="العنوان بالعربية"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-arabic text-right text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.descEn}
                  onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                  placeholder="Overview of the agenda, outcomes, and keynote highlights..."
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Academics, Spiritual, Media..."
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="session-published"
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                />
                <label
                  htmlFor="session-published"
                  className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer"
                >
                  Publish Immediately to Live Public Schedule
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingSession ? 'Save Changes' : 'Create Session'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
