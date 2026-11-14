'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import AIAssistant from '@/components/AIAssistant';
import ScrollRevealEffect from '@/components/ScrollRevealEffect';
import GalleryHero from '@/components/gallery/GalleryHero';
import StoryCirclesBar from '@/components/gallery/StoryCirclesBar';
import GalleryControlDeck from '@/components/gallery/GalleryControlDeck';
import GalleryMasonryView from '@/components/gallery/views/GalleryMasonryView';
import GalleryEditorialBentoView from '@/components/gallery/views/GalleryEditorialBentoView';
import GalleryHorizonCarouselView from '@/components/gallery/views/GalleryHorizonCarouselView';
import GalleryChronologicalTimeline from '@/components/gallery/views/GalleryChronologicalTimeline';
import CinematicLightbox from '@/components/gallery/CinematicLightbox';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { GalleryViewMode, GallerySortOption, GalleryItem } from '@/types/gallery';
import { Image as ImageIcon, Plus, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

export default function GalleryPage() {
  const { galleryItems } = useEvent();
  const { language, t, isRtl } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<GalleryViewMode>('masonry');
  const [activeMediaType, setActiveMediaType] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<GallerySortOption>('featured');
  const [isAudioSync, setIsAudioSync] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Global search modal listener
  useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  // Audio Soundtrack Sync
  const toggleAudioSync = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/humming-01.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }

    if (isAudioSync) {
      audioRef.current.pause();
      setIsAudioSync(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsAudioSync(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Filter published only
  const publishedItems = useMemo(() => {
    return galleryItems.filter((i) => i.published);
  }, [galleryItems]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: publishedItems.length };
    publishedItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [publishedItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return publishedItems
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle =
            item.title.en.toLowerCase().includes(q) ||
            (item.title.ml && item.title.ml.toLowerCase().includes(q)) ||
            (item.title.ar && item.title.ar.toLowerCase().includes(q));
          const matchCaption =
            (item.caption?.en && item.caption.en.toLowerCase().includes(q)) ||
            (item.caption?.ml && item.caption.ml.toLowerCase().includes(q));
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          const matchLocation = item.location?.en?.toLowerCase().includes(q);
          const matchPhotographer = item.photographer?.toLowerCase().includes(q);

          if (!matchTitle && !matchCaption && !matchTag && !matchLocation && !matchPhotographer) {
            return false;
          }
        }

        // Category filter
        if (activeCategory !== 'all' && item.category !== activeCategory) {
          return false;
        }

        // Media Type filter
        if (activeMediaType !== 'all' && item.mediaType !== activeMediaType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (activeSort) {
          case 'featured':
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.order || 0) - (b.order || 0);
          case 'newest':
            return (b.date || b.createdAt || '').localeCompare(a.date || a.createdAt || '');
          case 'oldest':
            return (a.date || a.createdAt || '').localeCompare(b.date || b.createdAt || '');
          case 'views':
            return (b.views || 0) - (a.views || 0);
          default:
            return (a.order || 0) - (b.order || 0);
        }
      });
  }, [publishedItems, searchQuery, activeCategory, activeMediaType, activeSort]);

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />

      <main id="main-content" className="flex-1 focus:outline-none">
        {/* Gallery Hero Section */}
        <GalleryHero
          totalCount={publishedItems.length}
          featuredCount={publishedItems.filter((i) => i.featured).length}
        />

        <div className="max-w-7xl mx-auto px-4 pb-24">
          {/* Stories of Horizon Circles Bar */}
          <StoryCirclesBar items={publishedItems} />

          {/* Interactive Control Deck */}
          <GalleryControlDeck
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeView={activeView}
            setActiveView={setActiveView}
            activeMediaType={activeMediaType}
            setActiveMediaType={setActiveMediaType}
            activeSort={activeSort}
            setActiveSort={setActiveSort}
            categoryCounts={categoryCounts}
            isAudioSync={isAudioSync}
            onToggleAudioSync={toggleAudioSync}
          />

          {/* Dynamic Views Display */}
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl glass-panel border border-brand-gold/30 p-16 text-center bg-black/5 dark:bg-black/20 my-10">
              <div className="w-16 h-16 rounded-3xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto mb-4 border border-brand-gold/30">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="font-clash text-xl font-bold text-brand-navy dark:text-white">
                {searchQuery || activeCategory !== 'all' || activeMediaType !== 'all'
                  ? 'No Artifacts Match Your Filter'
                  : t('gallery.emptyTitle') || 'The Horizon Gallery is Being Curated'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
                {searchQuery || activeCategory !== 'all' || activeMediaType !== 'all'
                  ? 'Try clearing your search query or selecting a different category to view more artifacts.'
                  : t('gallery.emptyDesc') ||
                    'Authentic visual moments from Camp UFUQ ’26 and Alathurpadi Dars will be showcased here. Camp organizers can upload media through the Admin Portal.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                {searchQuery || activeCategory !== 'all' || activeMediaType !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setActiveMediaType('all');
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-gold text-brand-navy hover:bg-brand-gold-hover transition-colors"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-brand-gold text-brand-navy text-xs font-bold hover:bg-brand-gold-hover transition-transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('gallery.openAdmin') || 'Admin Gallery Portal'}</span>
                  </Link>
                )}
              </div>
            </div>
          ) : activeView === 'masonry' ? (
            <GalleryMasonryView
              items={filteredItems}
              onOpenLightbox={openLightboxAt}
            />
          ) : activeView === 'bento' ? (
            <GalleryEditorialBentoView
              items={filteredItems}
              onOpenLightbox={openLightboxAt}
            />
          ) : activeView === 'carousel' ? (
            <GalleryHorizonCarouselView
              items={filteredItems}
              onOpenLightbox={openLightboxAt}
            />
          ) : (
            <GalleryChronologicalTimeline
              items={filteredItems}
              onOpenLightbox={openLightboxAt}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Cinematic Lightbox Modal */}
      <CinematicLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredItems}
        initialIndex={lightboxIndex}
      />

      {/* Global Assistive Layer */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AIAssistant />
      <ScrollRevealEffect />
    </div>
  );
}
