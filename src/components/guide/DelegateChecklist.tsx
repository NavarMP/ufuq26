'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Printer,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGuideStore } from '@/store/guideStore';
import { useShare } from '@/hooks/useShare';
import { useExport } from '@/hooks/useExport';
import UniversalExportModal from '@/components/export/UniversalExportModal';
import ExportTriggerButton from '@/components/export/ExportTriggerButton';
import { ExportColumn, ExportPreset, ExportFormat, executeExport } from '@/lib/export';
import { CHECKLIST_ITEMS } from '@/lib/guideData';
import { ChecklistItem } from '@/types/guide';

export default function DelegateChecklist() {
  const { language } = useApp();
  const { checkedItems, toggleChecklistItem, resetChecklist } = useGuideStore();
  const { openShare } = useShare();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'admission' | 'packing' | 'academic' | 'travel'>('all');

  const filteredItems = CHECKLIST_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const totalRequired = CHECKLIST_ITEMS.filter((i) => i.isRequired).length;
  const completedRequired = CHECKLIST_ITEMS.filter((i) => i.isRequired && checkedItems.includes(i.id)).length;
  const progressPercent = Math.round((checkedItems.length / CHECKLIST_ITEMS.length) * 100);

  const {
    isOpen: isExportModalOpen,
    activeConfig: exportModalConfig,
    isExporting,
    openExport,
    closeExport,
    runExport,
  } = useExport<ChecklistItem>();

  const checklistColumns: ExportColumn<ChecklistItem>[] = useMemo(
    () => [
      { id: 'category', header: 'Category', accessor: (i) => i.category.toUpperCase(), width: 14, defaultVisible: true },
      { id: 'text', header: 'Task / Item', accessor: (i) => i.text[language], width: 30, defaultVisible: true },
      { id: 'detail', header: 'Instructions', accessor: (i) => i.detail[language], width: 35, defaultVisible: true },
      { id: 'isRequired', header: 'Mandatory', accessor: (i) => (i.isRequired ? 'Yes' : 'Recommended'), width: 12, defaultVisible: true },
      { id: 'status', header: 'Status', accessor: (i) => (checkedItems.includes(i.id) ? 'Completed' : 'Pending'), width: 14, defaultVisible: true },
    ],
    [language, checkedItems]
  );

  const handleOpenExportModal = () => {
    openExport({
      title: "UFUQ ’26 Delegate Readiness Checklist",
      filenamePrefix: 'UFUQ26_Checklist',
      data: filteredItems,
      columns: checklistColumns,
      presets: [
        {
          id: 'full_checklist',
          title: 'Preparation Checklist (Excel)',
          description: 'All admission, packing, academic, and travel items in Excel',
          format: 'xlsx',
          visibleColumnIds: checklistColumns.map((c) => c.id),
        },
        {
          id: 'csv_checklist',
          title: 'Field Checklist (CSV)',
          description: 'Clean spreadsheet format for print and review',
          format: 'csv',
          visibleColumnIds: ['category', 'text', 'isRequired', 'status'],
        },
      ],
      defaultFormat: 'xlsx',
    });
  };

  const handleQuickExport = async (format: ExportFormat) => {
    await executeExport(
      {
        title: "UFUQ ’26 Delegate Readiness Checklist",
        filenamePrefix: 'UFUQ26_Checklist',
        data: filteredItems,
        columns: checklistColumns,
        defaultFormat: 'xlsx',
      },
      {
        format,
        scope: 'filtered',
        visibleColumnIds: checklistColumns.map((c) => c.id),
        maskPii: false,
      }
    );
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
            {language === 'ml' ? 'ഒരുക്കങ്ങളുടെ ചെക്ക്‌ലിസ്റ്റ്' : language === 'ar' ? 'قائمة الجاهزية والاستعداد' : 'Delegate Readiness Hub'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-clash font-bold text-brand-navy dark:text-white mt-1">
            {language === 'ml' ? 'ക്യാമ്പിലേക്ക് പുറപ്പെടും മുമ്പ്' : language === 'ar' ? 'قائمة التحقق قبل الانطلاق للمخيم' : 'Before You Step Onto Campus'}
          </h2>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-brand-gold font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{progressPercent}% {language === 'ml' ? 'തയ്യാറായി' : language === 'ar' ? 'جاهز' : 'Ready'}</span>
          </div>

          <ExportTriggerButton
            label="Export"
            count={filteredItems.length}
            onOpenModal={handleOpenExportModal}
            onQuickExport={handleQuickExport}
            variant="glass"
          />

          <button
            onClick={() => {
              openShare({
                title: `UFUQ ’26 Delegate Readiness: ${progressPercent}% Ready`,
                text: `I have completed ${completedRequired} of ${totalRequired} mandatory preparations for UFUQ ’26 Transition & Leadership Camp! December 24–30, 2026 at Alathurpadi Dars Campus.`,
                url: 'https://alathurpadidars.in/guide#checklist',
                type: 'custom',
                badgeText: `${progressPercent}% Ready`,
              });
            }}
            className="p-2 rounded-xl bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/15 text-neutral-700 dark:text-neutral-200 hover:text-brand-gold transition-colors"
            title="Share readiness status"
            aria-label="Share readiness status"
          >
            <Share2 className="w-4 h-4 text-brand-gold" />
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/15 text-neutral-700 dark:text-neutral-200 hover:text-brand-gold transition-colors"
            title="Print Field Card"
            aria-label="Print Field Card"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={resetChecklist}
            className="p-2 rounded-xl bg-white dark:bg-white/10 border border-neutral-300 dark:border-white/15 text-neutral-500 hover:text-red-500 transition-colors"
            title="Reset Checklist"
            aria-label="Reset Checklist"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs">
        {(['all', 'admission', 'packing', 'academic', 'travel'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy font-bold'
                : 'bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:border-brand-gold/40'
            }`}
          >
            {cat === 'all'
              ? language === 'ml' ? 'എല്ലാം' : language === 'ar' ? 'الكل' : 'All'
              : cat === 'admission'
              ? language === 'ml' ? 'രജിസ്ട്രേഷൻ' : language === 'ar' ? 'القبول' : 'Admission'
              : cat === 'packing'
              ? language === 'ml' ? 'വസ്ത്രങ്ങൾ' : language === 'ar' ? 'الأمتعة' : 'Packing'
              : cat === 'academic'
              ? language === 'ml' ? 'പഠനം' : language === 'ar' ? 'الأكاديميات' : 'Academic'
              : language === 'ml' ? 'യാത്ര' : language === 'ar' ? 'السفر' : 'Travel'}
          </button>
        ))}
      </div>

      {/* Checklist Items Container */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/30 shadow-xl space-y-3">
        {filteredItems.map((item) => {
          const isChecked = checkedItems.includes(item.id);

          return (
            <motion.div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              whileHover={{ x: 2 }}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                isChecked
                  ? 'bg-brand-gold/10 dark:bg-brand-gold/5 border-brand-gold/40'
                  : 'bg-white/70 dark:bg-white/5 border-neutral-200/60 dark:border-white/10 hover:border-brand-gold/30'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isChecked ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-400 hover:text-brand-gold transition-colors" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-sm font-semibold transition-colors ${
                      isChecked
                        ? 'line-through text-neutral-500 dark:text-neutral-400'
                        : 'text-brand-navy dark:text-white'
                    }`}
                  >
                    {item.text[language]}
                  </span>
                  {item.isRequired && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 shrink-0">
                      {language === 'ml' ? 'നിർബന്ധം' : language === 'ar' ? 'إلزامي' : 'Mandatory'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {item.detail[language]}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Footer Summary Strip */}
        <div className="pt-4 mt-6 border-t border-neutral-200/60 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            {completedRequired} of {totalRequired} mandatory requirements fulfilled.
          </div>
          <div className="text-[11px] italic">
            {language === 'ml'
              ? 'ചെക്ക്‌ലിസ്റ്റ് വിവരങ്ങൾ നിങ്ങളുടെ ഡിവൈസിൽ സ്വയം സൂക്ഷിക്കപ്പെടും.'
              : language === 'ar'
              ? 'تُحفظ عناصر القائمة تلقائياً في ذاكرة متصفحك للرجوع إليها لاحقاً.'
              : 'Progress automatically persists locally in your browser storage.'}
          </div>
        </div>
      </div>

      {/* Universal Export Suite Modal */}
      <UniversalExportModal
        isOpen={isExportModalOpen}
        onClose={closeExport}
        config={exportModalConfig}
        onExecute={runExport}
        isExporting={isExporting}
      />
    </section>
  );
}
