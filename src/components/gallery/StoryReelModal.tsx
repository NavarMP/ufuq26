'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';
import { GalleryItem } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface StoryReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  title: string;
}

export default function StoryReelModal({
  isOpen,
  onClose,
  items,
  title,
}: StoryReelModalProps) {
  const { language, isRtl } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const DURATION_MS = 5000; // 5 seconds per slide

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      soundEngine.playSnap();
      hapticEngine.trigger('subtle');
    } else {
      onClose();
    }
  }, [currentIndex, items.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      soundEngine.playSnap();
      hapticEngine.trigger('subtle');
    }
  }, [currentIndex]);

  // Timer loop
  useEffect(() => {
    if (!isOpen || isPaused || items.length === 0) return;

    const interval = 50; // update progress every 50ms
    const step = (interval / DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, handleNext, items.length]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setProgress(0);
      setIsPaused(false);
      soundEngine.playChime();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        isRtl ? handlePrev() : handleNext();
      } else if (e.key === 'ArrowLeft') {
        isRtl ? handleNext() : handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRtl, handleNext, handlePrev, onClose]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  const titleText = currentItem.title[language] || currentItem.title.en;
  const captionText = currentItem.caption?.[language] || currentItem.caption?.en;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none">
        {/* Fullscreen Reel Container */}
        <div
          className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden glass-panel border border-brand-gold/30 bg-black shadow-2xl flex flex-col justify-between"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Top Segmented Progress Bar */}
          <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
            {items.map((_, idx) => {
              let fillWidth = '0%';
              if (idx < currentIndex) fillWidth = '100%';
              else if (idx === currentIndex) fillWidth = `${progress}%`;

              return (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                >
                  <div
                    className="h-full bg-brand-gold transition-all duration-75 ease-linear rounded-full"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Header Bar */}
          <div className="absolute top-7 inset-x-4 z-30 flex items-center justify-between text-white drop-shadow">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-gold bg-brand-navy p-0.5">
                <Image
                  src="/images/UFUQ-Logo.svg"
                  alt="UFUQ"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left rtl:text-right">
                <span className="font-clash text-xs font-bold leading-tight flex items-center gap-1">
                  <span>{title}</span>
                  <Sparkles className="w-3 h-3 text-brand-gold" />
                </span>
                <span className="text-[10px] text-white/70">
                  {currentIndex + 1} of {items.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Content */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {currentItem.mediaType === 'video' ? (
              <video
                src={currentItem.url}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={currentItem.url}
                alt={titleText}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            )}

            {/* Tap areas for Prev / Next */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer"
            />

            {/* Gradient bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />
          </div>

          {/* Bottom Caption */}
          <div className="absolute bottom-5 inset-x-5 z-20 text-white space-y-1">
            <h4 className="font-clash text-base font-bold text-brand-gold-light leading-snug">
              {titleText}
            </h4>
            {captionText && (
              <p className="text-xs text-neutral-200 line-clamp-3 leading-relaxed">
                {captionText}
              </p>
            )}
            {currentItem.location?.en && (
              <span className="text-[10px] text-brand-gold font-medium block pt-1">
                📍 {currentItem.location[language] || currentItem.location.en}
              </span>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
