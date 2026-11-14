'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle } from 'lucide-react';
import { FAQ } from '@/types';

interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingFaq: FAQ | null;
  totalFaqsCount: number;
  onSave: (faq: Omit<FAQ, 'id'>) => Promise<void>;
}

export default function FaqFormModal({
  isOpen,
  onClose,
  editingFaq,
  totalFaqsCount,
  onSave,
}: FaqFormModalProps) {
  const [form, setForm] = useState({
    questionEn: '',
    questionMl: '',
    questionAr: '',
    answerEn: '',
    answerMl: '',
    answerAr: '',
    category: 'General',
    published: true,
    order: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingFaq) {
      setForm({
        questionEn: editingFaq.question.en,
        questionMl: editingFaq.question.ml || '',
        questionAr: editingFaq.question.ar || '',
        answerEn: editingFaq.answer.en,
        answerMl: editingFaq.answer.ml || '',
        answerAr: editingFaq.answer.ar || '',
        category: editingFaq.category || 'General',
        published: editingFaq.published,
        order: editingFaq.order,
      });
    } else {
      setForm({
        questionEn: '',
        questionMl: '',
        questionAr: '',
        answerEn: '',
        answerMl: '',
        answerAr: '',
        category: 'General',
        published: true,
        order: totalFaqsCount + 1,
      });
    }
  }, [editingFaq, totalFaqsCount, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.questionEn.trim() || !form.answerEn.trim()) {
      alert('Question and answer in English are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        question: {
          en: form.questionEn.trim(),
          ml: form.questionMl.trim() || undefined,
          ar: form.questionAr.trim() || undefined,
        },
        answer: {
          en: form.answerEn.trim(),
          ml: form.answerMl.trim() || undefined,
          ar: form.answerAr.trim() || undefined,
        },
        category: form.category.trim() || 'General',
        published: form.published,
        order: Number(form.order),
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save FAQ.');
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
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
                    {editingFaq ? 'Edit FAQ Entry' : 'Create New FAQ Entry'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Multilingual delegate assistance knowledge base
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
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Question (English) *
                </label>
                <input
                  type="text"
                  required
                  value={form.questionEn}
                  onChange={(e) => setForm({ ...form, questionEn: e.target.value })}
                  placeholder="e.g. What is the accommodation arrangement for residency delegates?"
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Answer (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.answerEn}
                  onChange={(e) => setForm({ ...form, answerEn: e.target.value })}
                  placeholder="Comprehensive explanation in English..."
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Question (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={form.questionMl}
                    onChange={(e) => setForm({ ...form, questionMl: e.target.value })}
                    placeholder="ചോദ്യം മലയാളത്തിൽ"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Question (Arabic)
                  </label>
                  <input
                    type="text"
                    value={form.questionAr}
                    onChange={(e) => setForm({ ...form, questionAr: e.target.value })}
                    placeholder="السؤال بالعربية"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-arabic text-right text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Answer (Malayalam)
                  </label>
                  <textarea
                    rows={2}
                    value={form.answerMl}
                    onChange={(e) => setForm({ ...form, answerMl: e.target.value })}
                    placeholder="ഉത്തരം മലയാളത്തിൽ..."
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Answer (Arabic)
                  </label>
                  <textarea
                    rows={2}
                    value={form.answerAr}
                    onChange={(e) => setForm({ ...form, answerAr: e.target.value })}
                    placeholder="الإجابة بالعربية..."
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-arabic text-right text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
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
                    placeholder="General, Travel, Academic..."
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Order
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
                  id="faq-published"
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                />
                <label
                  htmlFor="faq-published"
                  className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold cursor-pointer"
                >
                  Publish Immediately to FAQ Section
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
                  {isSubmitting ? 'Saving...' : editingFaq ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
