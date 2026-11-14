'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Share2,
  Download,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Calendar,
  MapPin,
  Camera,
  Tag,
  Star,
  Sparkles,
  Film,
  Check,
  Copy,
} from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface CinematicLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  initialIndex: number;
}

const CATEGORY_LABELS: Record<GalleryCategory, { en: string; ml: string; ar: string }> = {
  camp_moments: { en: "Camp UFUQ ’26", ml: "ക്യാമ്പ് നിമിഷങ്ങൾ", ar: "مخيم أفق '26" },
  dars_heritage: { en: "Dars Heritage", ml: "ദർസ് പാരമ്പര്യം", ar: "تراث الدَّرْس" },
  ustad_scholars: { en: "The Respected Ustads", ml: "ഉസ്താദുമാർ", ar: "الأساتذة والعلماء" },
  adsa_initiatives: { en: "ADSA & Alumni", ml: "അഡ്സ & പൂർവ്വവിദ്യാർത്ഥികൾ", ar: "رابطة أدسا والخريجون" },
  suffa_fraternity: { en: "39+ SUFFA Dars", ml: "39+ സുഫ ദർസുകൾ", ar: "اتحاد صُفَّة" },
  suhba_life: { en: "Philosophy of SUHBA", ml: "സുഹ്ബ & സാഹോദര്യം", ar: "فلسفة الصُّحْبَة" },
  digital_craft: { en: "Digital Craft", ml: "ഡിജിറ്റൽ അനുഭവം", ar: "الإبداع الرقمي" },
};

export default function CinematicLightbox({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
}: CinematicLightboxProps) {
  const { language, t, isRtl } = useApp();
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioSync, setIsAudioSync] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      setScale(1);
      soundEngine.playChime();
      hapticEngine.trigger('selection');
    }
  }, [isOpen, initialIndex]);

  const currentItem = items[index];

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setIndex((prev) => (prev + 1) % items.length);
    setScale(1);
    soundEngine.playSnap();
    hapticEngine.trigger('subtle');
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setIndex((prev) => (prev - 1 + items.length) % items.length);
    setScale(1);
    soundEngine.playSnap();
    hapticEngine.trigger('subtle');
  }, [items.length]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(4, prev + 0.5));
    soundEngine.playClick(1.2);
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(1, prev - 0.5));
    soundEngine.playClick(0.9);
  };

  const handleResetZoom = () => {
    setScale(1);
    soundEngine.playClick(1.0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowRight':
          e.preventDefault();
          isRtl ? handlePrev() : handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          isRtl ? handleNext() : handlePrev();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setShowInfo((prev) => !prev);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRtl, handleNext, handlePrev, onClose]);

  // Clean up audio on unmount or close
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      setIsAudioSync(false);
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!currentItem) return;
    const shareUrl = `${window.location.origin}/gallery?item=${currentItem.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentItem.title[language] || currentItem.title.en,
          text: currentItem.caption?.[language] || currentItem.caption?.en || 'UFUQ ’26 Horizon Artifact',
          url: shareUrl,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      soundEngine.playClick(1.4);
    } catch {}
  };

  const handleDownload = () => {
    if (!currentItem) return;
    const a = document.createElement('a');
    a.href = currentItem.url;
    a.download = `UFUQ26-${currentItem.category}-${currentItem.id}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    hapticEngine.trigger('success');
  };

  if (!isOpen || !currentItem) return null;

  const titleText = currentItem.title[language] || currentItem.title.en;
  const captionText = currentItem.caption?.[language] || currentItem.caption?.en;
  const categoryLabel = CATEGORY_LABELS[currentItem.category]?.[language] || currentItem.category;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none overflow-hidden">
        {/* TOP FLOATING CONTROL BAR */}
        <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Index & Category Pill */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold border border-brand-gold/30 backdrop-blur-md">
              {categoryLabel}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {index + 1} / {items.length}
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Soundtrack Sync */}
            <button
              onClick={toggleAudioSync}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                isAudioSync
                  ? 'bg-brand-gold text-brand-navy border-brand-gold shadow-lg shadow-brand-gold/20'
                  : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
              }`}
              title={isAudioSync ? 'Mute Soundtrack' : 'Sync Camp Humming Soundtrack'}
            >
              {isAudioSync ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center rounded-full bg-white/10 border border-white/15 p-0.5 backdrop-blur-md">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 1}
                className="p-2 rounded-full text-white/80 hover:text-white disabled:opacity-30 transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 text-[11px] font-mono text-white/80 hover:text-white"
                title="Reset Zoom"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="p-2 rounded-full text-white/80 hover:text-white disabled:opacity-30 transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Info Drawer Toggle */}
            <button
              onClick={() => setShowInfo((prev) => !prev)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                showInfo
                  ? 'bg-brand-gold text-brand-navy border-brand-gold'
                  : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
              }`}
              title="Show Details (I)"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 backdrop-blur-md transition-colors"
              title="Share Artifact"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Download */}
            {currentItem.downloadAllowed !== false && (
              <button
                onClick={handleDownload}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 backdrop-blur-md transition-colors"
                title="Download High-Res"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 border border-white/15 backdrop-blur-md transition-colors"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/15 hover:bg-rose-500/80 text-white border border-white/20 backdrop-blur-md transition-colors ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* PREV / NEXT ARROWS */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/40 hover:bg-brand-gold text-white hover:text-brand-navy border border-white/15 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Previous Artifact"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/40 hover:bg-brand-gold text-white hover:text-brand-navy border border-white/15 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Next Artifact"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* MAIN STAGE (ZOOMABLE / PAN-ABLE) */}
        <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-14 overflow-hidden">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: scale }}
            transition={{ duration: 0.25 }}
            drag={scale > 1}
            dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
            className="relative max-w-full max-h-[82vh] aspect-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {currentItem.mediaType === 'video' ? (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl border border-brand-gold/30"
              />
            ) : (
              <div className="relative w-[90vw] max-w-5xl h-[75vh]">
                <Image
                  src={currentItem.url}
                  alt={titleText}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  unoptimized
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* BOTTOM CAPTION BAR */}
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-12 z-30 flex flex-col items-center pointer-events-none">
          <div className="max-w-2xl px-6 py-3 rounded-2xl glass-panel bg-black/75 border border-brand-gold/30 text-center pointer-events-auto backdrop-blur-xl shadow-2xl">
            <h3 className="font-clash text-base sm:text-lg font-bold text-white tracking-wide">
              {titleText}
            </h3>
            {captionText && (
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-2">
                {captionText}
              </p>
            )}
            {currentItem.location?.en && (
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-gold mt-1.5 font-medium">
                <MapPin className="w-3 h-3" />
                <span>{currentItem.location[language] || currentItem.location.en}</span>
                {currentItem.date && (
                  <>
                    <span className="text-neutral-500">·</span>
                    <span>{currentItem.date}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR DETAILS DRAWER */}
        <AnimatePresence>
          {showInfo && (
            <motion.aside
              initial={{ opacity: 0, x: isRtl ? -350 : 350 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? -350 : 350 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`absolute top-0 bottom-0 ${
                isRtl ? 'left-0' : 'right-0'
              } w-full max-w-sm z-50 glass-panel bg-brand-navy-dark/95 border-l border-brand-gold/30 p-6 overflow-y-auto text-neutral-200 custom-scrollbar shadow-2xl backdrop-blur-2xl`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h4 className="font-clash text-base font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-brand-gold" />
                  <span>Artifact Metadata</span>
                </h4>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-5 space-y-5 text-xs">
                {/* Titles */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">
                    Title & Subject
                  </span>
                  <div className="text-sm font-bold text-white">{currentItem.title.en}</div>
                  {currentItem.title.ml && (
                    <div className="text-xs text-neutral-300 font-sans mt-0.5">{currentItem.title.ml}</div>
                  )}
                  {currentItem.title.ar && (
                    <div className="text-sm text-brand-gold font-arabic mt-0.5">{currentItem.title.ar}</div>
                  )}
                </div>

                {/* Caption / Description */}
                {(currentItem.caption?.en || currentItem.description?.en) && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">
                      Narrative Prose
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {currentItem.description?.en || currentItem.caption?.en}
                    </p>
                  </div>
                )}

                {/* Category & Pillar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-neutral-400">Pillar</span>
                  <span className="font-semibold text-brand-gold">
                    {categoryLabel}
                  </span>
                </div>

                {/* Location & Dates */}
                <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/10">
                  {currentItem.location?.en && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-gold" /> Location
                      </span>
                      <span className="text-white font-medium text-right">
                        {currentItem.location[language] || currentItem.location.en}
                      </span>
                    </div>
                  )}

                  {currentItem.date && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-gold" /> Date
                      </span>
                      <span className="text-white font-mono">{currentItem.date}</span>
                    </div>
                  )}

                  {currentItem.hijriDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brand-gold" /> Hijri
                      </span>
                      <span className="text-brand-gold font-arabic text-xs font-semibold">
                        {currentItem.hijriDate}
                      </span>
                    </div>
                  )}

                  {currentItem.photographer && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-brand-gold" /> Credit
                      </span>
                      <span className="text-white font-medium">{currentItem.photographer}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {currentItem.tags && currentItem.tags.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-2">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-brand-gold" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Link Copy Button */}
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold border border-brand-gold/30 font-semibold transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Artifact Link</span>
                    </>
                  )}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
