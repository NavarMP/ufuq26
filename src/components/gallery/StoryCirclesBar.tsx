'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, Compass, BookOpen, Users, Building2, Heart, Cpu } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import StoryReelModal from './StoryReelModal';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface StoryCirclesBarProps {
  items: GalleryItem[];
}

interface StoryCircleGroup {
  id: string;
  title: string;
  category: GalleryCategory;
  coverUrl: string;
  items: GalleryItem[];
}

const CATEGORY_ICONS: Record<GalleryCategory, React.ComponentType<{ className?: string }>> = {
  camp_moments: Compass,
  dars_heritage: BookOpen,
  ustad_scholars: Sparkles,
  adsa_initiatives: Users,
  suffa_fraternity: Building2,
  suhba_life: Heart,
  digital_craft: Cpu,
};

const CATEGORY_NAMES: Record<GalleryCategory, { en: string; ml: string; ar: string }> = {
  camp_moments: { en: "Camp UFUQ", ml: "ക്യാമ്പ്", ar: "معسكر أفق" },
  dars_heritage: { en: "Dars Heritage", ml: "പാരമ്പര്യം", ar: "تراث الدار" },
  ustad_scholars: { en: "The Ustads", ml: "ഉസ്താദുമാർ", ar: "الأساتذة" },
  adsa_initiatives: { en: "ADSA Council", ml: "അഡ്സ", ar: "رابطة أدسا" },
  suffa_fraternity: { en: "39+ SUFFA", ml: "സുഫ ദർസുകൾ", ar: "اتحاد صُفّة" },
  suhba_life: { en: "SUHBA Brotherhood", ml: "സുഹ്ബ", ar: "الصحبة" },
  digital_craft: { en: "Digital Craft", ml: "ഡിജിറ്റൽ", ar: "الإبداع التقني" },
};

export default function StoryCirclesBar({ items }: StoryCirclesBarProps) {
  const { language, t } = useApp();
  const [activeStory, setActiveStory] = useState<StoryCircleGroup | null>(null);

  // Group published items into story reels
  const storyGroups = useMemo(() => {
    const published = items.filter((i) => i.published);
    if (published.length === 0) return [];

    // Group by category (or storyGroup if present)
    const groupMap = new Map<string, GalleryItem[]>();

    published.forEach((item) => {
      const key = item.storyGroup || item.category;
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(item);
    });

    const groups: StoryCircleGroup[] = [];

    groupMap.forEach((groupItems, key) => {
      const first = groupItems[0];
      const cat = first.category;
      const titleName =
        CATEGORY_NAMES[cat]?.[language] ||
        first.storyGroup ||
        CATEGORY_NAMES[cat]?.en ||
        'Story Reel';

      groups.push({
        id: key,
        title: titleName,
        category: cat,
        coverUrl: first.thumbnailUrl || first.url,
        items: groupItems,
      });
    });

    return groups;
  }, [items, language]);

  if (storyGroups.length === 0) {
    return null;
  }

  const handleOpenStory = (group: StoryCircleGroup) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    setActiveStory(group);
  };

  return (
    <>
      <div className="w-full mb-10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            {t('gallery.storiesTitle') || 'Stories of Horizon'}
          </span>
          <span className="text-[11px] text-neutral-400">
            · {t('gallery.storiesSubtitle') || 'Tap to watch reels'}
          </span>
        </div>

        {/* Horizontal scroll circles */}
        <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 px-1 custom-scrollbar no-scrollbar scroll-smooth">
          {storyGroups.map((group) => {
            const Icon = CATEGORY_ICONS[group.category] || Sparkles;
            return (
              <button
                key={group.id}
                onClick={() => handleOpenStory(group)}
                className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none focus-visible:scale-105"
              >
                {/* Glowing Outer Ring */}
                <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-brand-gold via-amber-300 to-brand-gold-light shadow-md shadow-brand-gold/20 group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden p-0.5 bg-brand-navy">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      {group.coverUrl ? (
                        <Image
                          src={group.coverUrl}
                          alt={group.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-navy text-brand-gold">
                          <Icon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-brand-navy border border-brand-gold flex items-center justify-center text-brand-gold shadow">
                    <Icon className="w-3 h-3" />
                  </div>
                </div>

                {/* Title */}
                <span className="text-xs font-medium text-neutral-200 group-hover:text-brand-gold transition-colors max-w-[80px] truncate text-center">
                  {group.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Modal Player */}
      {activeStory && (
        <StoryReelModal
          isOpen={Boolean(activeStory)}
          onClose={() => setActiveStory(null)}
          items={activeStory.items}
          title={activeStory.title}
        />
      )}
    </>
  );
}
