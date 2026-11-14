'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Download, Copy, Share2, Sparkles, Check, RefreshCw } from 'lucide-react';
import { renderPosterToCanvas } from '@/lib/og/canvasPosterBuilder';
import { useShare } from '@/hooks/useShare';
import { useApp } from '@/context/AppContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import TiltCard from '@/components/effects/TiltCard';
import { StoryTheme, StoryFormat } from '@/types/share';
import toast from 'react-hot-toast';

interface StoryCardGeneratorProps {
  className?: string;
  initialTheme?: StoryTheme;
}

export default function StoryCardGenerator({ className = '', initialTheme }: StoryCardGeneratorProps) {
  const { payload } = useShare();
  const { t } = useApp();
  const { triggerSuccess, triggerLight } = useHapticFeedback();
  const { playSuccessChime, playTick } = useAudioFeedback();

  // Determine starting theme
  const startingTheme: StoryTheme = initialTheme || (payload.attendee ? 'pass' : payload.session ? 'session' : 'horizon');
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme>(startingTheme);
  const [selectedFormat, setSelectedFormat] = useState<StoryFormat>('story');
  const [isRendering, setIsRendering] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);
    try {
      await renderPosterToCanvas(canvas, payload, selectedTheme, selectedFormat);
    } catch (err) {
      console.error('Error rendering poster:', err);
    } finally {
      setIsRendering(false);
    }
  }, [payload, selectedTheme, selectedFormat]);

  useEffect(() => {
    renderCard();
  }, [renderCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    triggerSuccess();
    playSuccessChime();

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const fileName = `UFUQ26-${selectedTheme}-${selectedFormat}-${Date.now()}.png`;
    link.download = fileName;
    link.href = dataUrl;
    link.click();
    toast.success('High-resolution card downloaded!');
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    triggerLight();
    playTick();

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedImage(true);
        triggerSuccess();
        playSuccessChime();
        toast.success(t('share.story.copiedImage') || 'Card copied to clipboard!');
        setTimeout(() => setCopiedImage(false), 2200);
      });
    } catch {
      toast.error('Direct image copy not supported. Please use Download PNG.');
    }
  };

  const handleShareDirect = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    triggerLight();
    playTick();

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'ufuq26-story.png', { type: 'image/png' });

        if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: payload.title,
            text: payload.text,
            files: [file],
          });
          triggerSuccess();
        } else {
          toast.error('Sharing image files is not supported on this device. Use Download.');
        }
      });
    } catch {
      // Cancelled by user
    }
  };

  const canShareImage = typeof navigator !== 'undefined' && typeof navigator.canShare === 'function';

  return (
    <div className={`space-y-4 p-4 text-left rtl:text-right ${className}`}>
      {/* Header text */}
      <div>
        <h4 className="font-clash text-sm font-bold text-brand-navy dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span>{t('share.story.heading') || 'Visual Story Card Studio'}</span>
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t('share.story.subheading') || 'Generate high-res cards for Instagram Stories & WhatsApp Status'}
        </p>
      </div>

      {/* Control Pills: Theme Selector & Format Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-brand-gold/15">
        {/* Themes */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          <button
            type="button"
            onClick={() => {
              setSelectedTheme('horizon');
              playTick();
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedTheme === 'horizon'
                ? 'bg-brand-gold text-brand-navy shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
            }`}
          >
            {t('share.story.horizon') || 'Camp Horizon'}
          </button>

          {payload.attendee && (
            <button
              type="button"
              onClick={() => {
                setSelectedTheme('pass');
                playTick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedTheme === 'pass'
                  ? 'bg-brand-gold text-brand-navy shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
              }`}
            >
              {t('share.story.pass') || 'Attendee Pass'}
            </button>
          )}

          {payload.session && (
            <button
              type="button"
              onClick={() => {
                setSelectedTheme('session');
                playTick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedTheme === 'session'
                  ? 'bg-brand-gold text-brand-navy shadow-sm'
                  : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
              }`}
            >
              {t('share.story.session') || 'Session Spotlight'}
            </button>
          )}
        </div>

        {/* Format Toggle */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-brand-gold/15 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSelectedFormat('story');
              playTick();
            }}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
              selectedFormat === 'story' ? 'bg-brand-navy text-brand-gold font-bold shadow-sm' : 'text-neutral-500'
            }`}
          >
            9:16 Story
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFormat('square');
              playTick();
            }}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
              selectedFormat === 'square' ? 'bg-brand-navy text-brand-gold font-bold shadow-sm' : 'text-neutral-500'
            }`}
          >
            1:1 Square
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFormat('feed');
              playTick();
            }}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
              selectedFormat === 'feed' ? 'bg-brand-navy text-brand-gold font-bold shadow-sm' : 'text-neutral-500'
            }`}
          >
            16:9 Post
          </button>
        </div>
      </div>

      {/* 3D Tilt Preview Container */}
      <div className="flex items-center justify-center p-2 rounded-2xl bg-black/10 dark:bg-black/40 border border-brand-gold/20 overflow-hidden">
        <TiltCard maxTilt={10} className="w-full flex justify-center">
          <div className="relative group cursor-pointer shadow-2xl rounded-2xl overflow-hidden border border-brand-gold/40">
            <canvas
              ref={canvasRef}
              className={`max-h-[340px] sm:max-h-[380px] w-auto object-contain rounded-2xl transition-opacity duration-300 ${
                isRendering ? 'opacity-40' : 'opacity-100'
              }`}
            />
            {isRendering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm text-brand-gold font-bold text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('share.story.generating') || 'Rendering...'}</span>
              </div>
            )}
          </div>
        </TiltCard>
      </div>

      {/* Studio Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isRendering}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-gold text-brand-navy hover:bg-brand-gold-hover text-xs font-bold shadow-md shadow-brand-gold/20 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{t('share.story.download') || 'Download PNG (1080×1920)'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyImage}
          disabled={isRendering}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all active:scale-95"
        >
          {copiedImage ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-brand-gold" />}
          <span>{copiedImage ? 'Copied' : t('share.story.copyImage') || 'Copy Image'}</span>
        </button>

        {canShareImage && (
          <button
            type="button"
            onClick={handleShareDirect}
            disabled={isRendering}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-800 dark:text-neutral-100 border border-white/20 text-xs font-semibold transition-all active:scale-95"
            title="Post direct to Instagram Stories or WhatsApp"
          >
            <Share2 className="w-4 h-4 text-brand-gold" />
            <span>Story</span>
          </button>
        )}
      </div>
    </div>
  );
}
