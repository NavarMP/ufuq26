'use client';

import React from 'react';
import {
  Search,
  LayoutGrid,
  Layers,
  Sliders,
  Calendar,
  Filter,
  Volume2,
  VolumeX,
  Compass,
  BookOpen,
  Sparkles,
  Users,
  Building2,
  Heart,
  Cpu,
} from 'lucide-react';
import { GalleryCategory, GalleryViewMode, GalleryMediaType, GallerySortOption } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface GalleryControlDeckProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeView: GalleryViewMode;
  setActiveView: (view: GalleryViewMode) => void;
  activeMediaType: string;
  setActiveMediaType: (type: string) => void;
  activeSort: GallerySortOption;
  setActiveSort: (sort: GallerySortOption) => void;
  categoryCounts: Record<string, number>;
  isAudioSync: boolean;
  onToggleAudioSync: () => void;
}

const CATEGORIES: { id: string; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', labelKey: 'all', icon: Layers },
  { id: 'camp_moments', labelKey: 'camp_moments', icon: Compass },
  { id: 'dars_heritage', labelKey: 'dars_heritage', icon: BookOpen },
  { id: 'ustad_scholars', labelKey: 'ustad_scholars', icon: Sparkles },
  { id: 'adsa_initiatives', labelKey: 'adsa_initiatives', icon: Users },
  { id: 'suffa_fraternity', labelKey: 'suffa_fraternity', icon: Building2 },
  { id: 'suhba_life', labelKey: 'suhba_life', icon: Heart },
  { id: 'digital_craft', labelKey: 'digital_craft', icon: Cpu },
];

export default function GalleryControlDeck({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeView,
  setActiveView,
  activeMediaType,
  setActiveMediaType,
  activeSort,
  setActiveSort,
  categoryCounts,
  isAudioSync,
  onToggleAudioSync,
}: GalleryControlDeckProps) {
  const { t } = useApp();

  const handleCategorySelect = (id: string) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    setActiveCategory(id);
  };

  const handleViewSelect = (mode: GalleryViewMode) => {
    soundEngine.playSnap();
    hapticEngine.trigger('subtle');
    setActiveView(mode);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Top Deck: Search, View Mode Switcher, Audio Sync, Sort */}
      <div className="p-4 rounded-3xl glass-panel border border-brand-gold/30 bg-black/5 dark:bg-black/30 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('gallery.searchPlaceholder') || 'Search by caption, tags, location, or scholar...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-800 dark:text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Right Controls: Sort, View Switcher, Audio Sync */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
            {/* Sort Selector */}
            <select
              value={activeSort}
              onChange={(e) => {
                soundEngine.playClick();
                setActiveSort(e.target.value as GallerySortOption);
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-brand-gold"
            >
              <option value="featured" className="bg-brand-navy text-white">
                {t('gallery.sort.featured') || 'Curated / Featured'}
              </option>
              <option value="newest" className="bg-brand-navy text-white">
                {t('gallery.sort.newest') || 'Newest Added'}
              </option>
              <option value="oldest" className="bg-brand-navy text-white">
                {t('gallery.sort.oldest') || 'Historical First'}
              </option>
              <option value="views" className="bg-brand-navy text-white">
                {t('gallery.sort.views') || 'Most Viewed'}
              </option>
            </select>

            {/* View Mode Buttons */}
            <div className="flex items-center rounded-2xl bg-white/10 dark:bg-white/5 border border-white/15 p-1">
              <button
                onClick={() => handleViewSelect('masonry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'masonry'
                    ? 'bg-brand-gold text-brand-navy shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-white'
                }`}
                title="Masonry Flow Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('gallery.views.masonry') || 'Masonry'}</span>
              </button>

              <button
                onClick={() => handleViewSelect('bento')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'bento'
                    ? 'bg-brand-gold text-brand-navy shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-white'
                }`}
                title="Editorial Bento"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('gallery.views.bento') || 'Bento'}</span>
              </button>

              <button
                onClick={() => handleViewSelect('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'carousel'
                    ? 'bg-brand-gold text-brand-navy shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-white'
                }`}
                title="3D Horizon Carousel"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('gallery.views.carousel') || 'Carousel'}</span>
              </button>

              <button
                onClick={() => handleViewSelect('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeView === 'timeline'
                    ? 'bg-brand-gold text-brand-navy shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-white'
                }`}
                title="Historical Timeline Flow"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('gallery.views.timeline') || 'Timeline'}</span>
              </button>
            </div>

            {/* Audio Sync Toggle */}
            <button
              onClick={onToggleAudioSync}
              className={`p-2.5 rounded-2xl border transition-all ${
                isAudioSync
                  ? 'bg-brand-gold text-brand-navy border-brand-gold shadow-lg shadow-brand-gold/30'
                  : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
              title={isAudioSync ? 'Soundtrack Playing' : 'Sync Camp Soundtrack'}
            >
              {isAudioSync ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Media Type Sub-Filter Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/10 overflow-x-auto custom-scrollbar no-scrollbar text-xs">
          {[
            { id: 'all', label: t('gallery.allMedia') || 'All Media' },
            { id: 'image', label: t('gallery.photos') || 'Photographs' },
            { id: 'video', label: t('gallery.videos') || 'Reels & Video' },
            { id: 'document', label: t('gallery.documents') || 'Documents' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                soundEngine.playClick(1.1);
                setActiveMediaType(type.id);
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-colors shrink-0 ${
                activeMediaType === type.id
                  ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-gold text-brand-navy shadow-lg shadow-brand-gold/20 scale-[1.02]'
                  : 'glass-panel text-neutral-700 dark:text-neutral-300 hover:text-brand-gold hover:border-brand-gold/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t(`gallery.categories.${cat.labelKey}`) || cat.labelKey}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-brand-navy/20 text-brand-navy' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
