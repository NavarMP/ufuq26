'use client';

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from 'lucide-react';
import { FAQ } from '@/types';
import FaqFormModal from './FaqFormModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import StatusBadge from '../shared/StatusBadge';

interface FaqsManagerProps {
  faqs: FAQ[];
  addFAQ: (faq: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
}

export default function FaqsManager({
  faqs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
}: FaqsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter((f) => {
        if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          f.question.en.toLowerCase().includes(q) ||
          (f.question.ml && f.question.ml.toLowerCase().includes(q)) ||
          f.answer.en.toLowerCase().includes(q) ||
          (f.answer.ml && f.answer.ml.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs by question or answer keywords..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingFaq(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQs List */}
      {filteredFaqs.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-3xl p-8 space-y-3">
          <HelpCircle className="w-10 h-10 text-brand-gold/40 mx-auto" />
          <p>No FAQs match the current query &ldquo;{searchQuery}&rdquo;.</p>
          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setModalOpen(true);
            }}
            className="text-brand-gold font-bold underline"
          >
            Create first FAQ entry
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 hover:border-brand-gold/40 shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1 text-left">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {faq.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                      {faq.category}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-neutral-400">
                    Order #{faq.order}
                  </span>
                  <StatusBadge
                    status={faq.published ? 'published' : 'draft'}
                    showDot={true}
                  />
                </div>

                <h4 className="font-clash font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {faq.question.en}
                </h4>

                {faq.question.ml && (
                  <p className="text-xs text-neutral-500 font-medium">
                    {faq.question.ml}
                  </p>
                )}

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
                  {faq.answer.en}
                </p>

                {faq.answer.ml && (
                  <p className="text-[11px] text-neutral-500 leading-relaxed italic">
                    {faq.answer.ml}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-1">
                <button
                  type="button"
                  onClick={() => updateFAQ(faq.id, { published: !faq.published })}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                    faq.published
                      ? 'text-emerald-500 hover:bg-emerald-500/10'
                      : 'text-neutral-400 hover:bg-neutral-500/10'
                  }`}
                  title={faq.published ? 'Unpublish from FAQ section' : 'Publish to live website'}
                >
                  {faq.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(faq);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-brand-gold hover:bg-brand-gold/10 transition-colors"
                  title="Edit FAQ"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete FAQ Entry',
                      description: `Are you sure you want to delete this FAQ: "${faq.question.en}"?`,
                      onConfirm: async () => {
                        await deleteFAQ(faq.id);
                        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Form Modal */}
      <FaqFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingFaq={editingFaq}
        totalFaqsCount={faqs.length}
        onSave={async (payload) => {
          if (editingFaq) {
            await updateFAQ(editingFaq.id, payload);
          } else {
            await addFAQ(payload);
          }
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
