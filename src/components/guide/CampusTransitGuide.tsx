'use client';

import React from 'react';
import { Plane, Train, Bus, MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TRANSIT_HUBS } from '@/lib/guideData';

const ICON_MAP = {
  airport: Plane,
  railway: Train,
  bus: Bus,
};

export default function CampusTransitGuide() {
  const { language } = useApp();

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
            {language === 'ml' ? 'യാത്രാ സൗകര്യങ്ങൾ & മാപ്പ്' : language === 'ar' ? 'المواصلات وخريطة الوصول' : 'Transit & Venue Logistics'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-clash font-bold text-brand-navy dark:text-white mt-1">
            {language === 'ml' ? 'അലാത്തുർപടി ക്യാമ്പസിലേക്ക് എങ്ങനെ എത്താം?' : language === 'ar' ? 'كيفية الوصول إلى مجمع ألاطوربادي' : 'Reaching Alathurpadi Dars Campus'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          {language === 'ml'
            ? 'കോഴിക്കോട് എയർപോർട്ട്, അങ്ങാടിപ്പുറം, തിരൂർ റെയിൽവേ സ്റ്റേഷനുകൾ എന്നിവ വഴി ക്യാമ്പസിലേക്ക് എത്തിച്ചേരാനുള്ള വഴികൾ.'
            : language === 'ar'
            ? 'أقرب المطارات ومحطات القطار والحافلات لمقر المخيم في ملابورم مع تقدير زمن الوصول ووسائل النقل الموصى بها.'
            : 'Detailed transit routing from major regional air, rail, and bus hubs across Kerala to the campus gates.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TRANSIT_HUBS.map((hub) => {
          const Icon = ICON_MAP[hub.type];

          return (
            <div
              key={hub.id}
              className="rounded-2xl glass-panel p-5 border border-brand-gold/25 hover:border-brand-gold/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-navy dark:text-brand-gold-light bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded">
                    {hub.code}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-brand-navy dark:text-white mb-1">
                  {hub.name[language]}
                </h3>

                <div className="flex items-center gap-2 text-xs font-mono text-brand-gold font-bold mb-3">
                  <span>{hub.distanceKm} km</span>
                  <span>·</span>
                  <span>{hub.travelTime[language]}</span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  {hub.routeDescription[language]}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 dark:border-white/10 text-[11px]">
                <span className="text-neutral-400 block mb-0.5 uppercase tracking-wider text-[9px] font-bold">
                  {language === 'ml' ? 'നിർദ്ദേശിക്കുന്ന വാഹനം' : language === 'ar' ? 'وسيلة النقل الموصى بها' : 'Recommended Transit'}
                </span>
                <span className="font-medium text-brand-navy dark:text-brand-gold">
                  {hub.recommendedTransport[language]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Location Map & Helpdesk Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-brand-navy to-brand-dark-surface border border-brand-gold/40 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Alathurpadi Dars Campus · Malappuram, Kerala</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-clash font-bold text-white">
            {language === 'ml' ? 'ക്യാമ്പസ് ഹെൽപ്പ്‌ഡെസ്ക് & വളണ്ടിയർ സപ്പോർട്ട്' : language === 'ar' ? 'مكتب الاستقبال والدعم الميداني' : '24/7 Welcome Desk & Transit Support'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            {language === 'ml'
              ? 'യാത്രാവേളയിൽ എന്തെങ്കിലും സംശയങ്ങളോ സഹായമോ ആവശ്യമുണ്ടെങ്കിൽ അഡ്സ ട്രാൻസിറ്റ് വളണ്ടിയർമാരുമായി ബന്ധപ്പെടാം.'
              : language === 'ar'
              ? 'فريق متطوعي الاستقبال متواجد على مدار الساعة لتقديم الدعم والإرشاد لجميع الطلاب والضيوف القادمين.'
              : 'Our dedicated student logistics volunteers operate airport shuttles and provide round-the-clock guidance.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://maps.google.com/?q=Alathurpadi+Dars+Malappuram"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs sm:text-sm hover:bg-brand-gold-light transition-all shadow-lg"
          >
            <Navigation className="w-4 h-4" />
            <span>{language === 'ml' ? 'ഗൂഗിൾ മാപ്പ് തുറക്കുക' : language === 'ar' ? 'فتح خرائط جوجل' : 'Open in Google Maps'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
