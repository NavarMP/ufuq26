'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

interface MiniSpectrumBarsProps {
  barCount?: number;
  className?: string;
}

export default function MiniSpectrumBars({ barCount = 4, className = '' }: MiniSpectrumBarsProps) {
  const { isPlaying, isMuted, getFrequencyData } = useAudio();
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    dataArrayRef.current = new Uint8Array(32);

    const updateBars = () => {
      if (dataArrayRef.current) {
        getFrequencyData(dataArrayRef.current);
        const data = dataArrayRef.current;

        // Choose frequency bins distributed across bass to treble
        const binIndices = [2, 6, 12, 18];

        barRefs.current.forEach((bar, idx) => {
          if (!bar) return;
          if (isPlaying && !isMuted) {
            const binIdx = binIndices[idx % binIndices.length];
            const rawVal = data[binIdx] || 0; // 0 to 255
            const normalized = rawVal / 255;
            // Height between 4px and 16px
            const height = Math.max(3, Math.min(16, 3 + normalized * 13));
            bar.style.height = `${height}px`;
            bar.style.opacity = `${0.6 + normalized * 0.4}`;
          } else {
            // Calm resting state
            bar.style.height = '3px';
            bar.style.opacity = '0.4';
          }
        });
      }

      animFrameRef.current = requestAnimationFrame(updateBars);
    };

    animFrameRef.current = requestAnimationFrame(updateBars);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [getFrequencyData, isMuted, isPlaying]);

  return (
    <div className={`flex items-end gap-[2px] h-4 px-1 ${className}`} aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          className="w-[2.5px] rounded-full bg-brand-gold transition-[height] duration-75 ease-out"
          style={{ height: '3px', opacity: 0.4 }}
        />
      ))}
    </div>
  );
}
