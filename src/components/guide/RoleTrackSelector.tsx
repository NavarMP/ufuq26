'use client';

import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Building2, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { useGuideStore } from '@/store/guideStore';
import { useApp } from '@/context/AppContext';
import { GUIDE_ROLES } from '@/lib/guideData';
import { GuideRole } from '@/types/guide';

const ICON_MAP: Record<GuideRole, React.ComponentType<{ className?: string }>> = {
  delegate: GraduationCap,
  mudarris: Building2,
  organizer: ShieldCheck,
  guest: Compass,
};

export default function RoleTrackSelector() {
  const { activeRole, setActiveRole } = useGuideStore();
  const { language } = useApp();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
            {language === 'ml' ? 'നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക' : language === 'ar' ? 'حدد مسارك المستهدف' : 'Personalized Experience Tracks'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-clash font-bold text-brand-navy dark:text-white mt-1">
            {language === 'ml' ? 'നിങ്ങൾ ആർക്കുവേണ്ടിയാണ് അന്വേഷിക്കുന്നത്?' : language === 'ar' ? 'من أنت في أُفُق ’26؟' : 'Who Are You in UFUQ ’26?'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          {language === 'ml'
            ? 'നിങ്ങളുടെ പങ്കാളിത്തത്തിന് അനുയോജ്യമായ പ്രത്യേക നിർദ്ദേശങ്ങളും വഴികാട്ടികളും ലഭ്യമാക്കാൻ റോൾ തിരഞ്ഞെടുക്കുക.'
            : language === 'ar'
            ? 'اختر صفتك في المخيم لعرض الإرشادات والجداول المخصصة لدورك بدقة متناهية.'
            : 'Select your role to filter the interactive manual, checklist, and operational procedures tailored to your needs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GUIDE_ROLES.map((roleItem) => {
          const isSelected = activeRole === roleItem.id;
          const Icon = ICON_MAP[roleItem.id];

          return (
            <motion.button
              key={roleItem.id}
              onClick={() => setActiveRole(roleItem.id)}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 rounded-2xl text-left rtl:text-right transition-all duration-300 border flex flex-col justify-between h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-brand-navy/95 to-brand-navy dark:from-brand-gold/15 dark:to-brand-gold/5 border-brand-gold shadow-xl shadow-brand-gold/10'
                  : 'bg-white/80 dark:bg-brand-navy/30 border-neutral-200 dark:border-white/10 hover:border-brand-gold/40 hover:bg-white dark:hover:bg-brand-navy/50'
              }`}
            >
              {/* Active Golden Glow Accent */}
              {isSelected && (
                <motion.div
                  layoutId="activeRoleHalo"
                  className="absolute -top-12 -right-12 w-28 h-28 bg-brand-gold/25 rounded-full blur-2xl pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-brand-gold text-brand-navy shadow-md'
                        : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'ml' ? 'തിരഞ്ഞെടുത്തു' : language === 'ar' ? 'المسار النشط' : 'Active Track'}
                    </span>
                  )}
                </div>

                <h3
                  className={`text-base font-clash font-bold mb-1.5 transition-colors ${
                    isSelected ? 'text-white dark:text-brand-gold' : 'text-brand-navy dark:text-white'
                  }`}
                >
                  {roleItem.title[language]}
                </h3>

                <p
                  className={`text-xs leading-relaxed transition-colors ${
                    isSelected ? 'text-neutral-200 dark:text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {roleItem.desc[language]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/40 dark:border-white/10 flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-brand-gold font-medium' : 'text-neutral-400'}>
                  {language === 'ml' ? 'വഴികാട്ടി കാണുക →' : language === 'ar' ? 'عرض الدليل ←' : 'Explore Track →'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
