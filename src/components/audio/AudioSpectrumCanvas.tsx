'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

interface AudioSpectrumCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AudioSpectrumCanvas({
  width = 280,
  height = 56,
  className = '',
}: AudioSpectrumCanvasProps) {
  const { isPlaying, isMuted, getFrequencyData } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const smoothedBarsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High DPI displays
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const barCount = 22;
    dataArrayRef.current = new Uint8Array(32);
    if (smoothedBarsRef.current.length !== barCount) {
      smoothedBarsRef.current = new Array(barCount).fill(0);
    }

    let idlePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const active = isPlaying && !isMuted;
      if (active && dataArrayRef.current) {
        getFrequencyData(dataArrayRef.current);
        const data = dataArrayRef.current;

        const gap = 3;
        const totalGap = gap * (barCount - 1);
        const barWidth = Math.max(2, (width - totalGap) / barCount);

        for (let i = 0; i < barCount; i++) {
          // Map index to frequency bins with slightly more weight on low-mids
          const binIndex = Math.min(31, Math.floor((i / barCount) * 28) + 1);
          const raw = data[binIndex] || 0;
          const targetHeight = Math.max(3, (raw / 255) * (height - 6));

          // Smooth decay
          smoothedBarsRef.current[i] =
            smoothedBarsRef.current[i] * 0.7 + targetHeight * 0.3;

          const currentH = smoothedBarsRef.current[i];
          const x = i * (barWidth + gap);
          const y = height - currentH;

          // Gradient color: gold to light warm amber
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, '#ecdcb9');
          gradient.addColorStop(0.5, '#c9a45c');
          gradient.addColorStop(1, '#977233');

          ctx.fillStyle = gradient;
          ctx.shadowColor = 'rgba(201, 164, 92, 0.4)';
          ctx.shadowBlur = 6;

          // Draw rounded top bar
          drawRoundedBar(ctx, x, y, barWidth, currentH, 2);
        }
      } else {
        // Idle gentle wave animation when paused
        idlePhase += 0.04;
        const gap = 3;
        const totalGap = gap * (barCount - 1);
        const barWidth = Math.max(2, (width - totalGap) / barCount);

        for (let i = 0; i < barCount; i++) {
          const sine = Math.sin(idlePhase + i * 0.35);
          const idleH = Math.max(3, 4 + sine * 3);

          smoothedBarsRef.current[i] =
            smoothedBarsRef.current[i] * 0.85 + idleH * 0.15;

          const currentH = smoothedBarsRef.current[i];
          const x = i * (barWidth + gap);
          const y = height - currentH;

          ctx.fillStyle = 'rgba(201, 164, 92, 0.3)';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;

          drawRoundedBar(ctx, x, y, barWidth, currentH, 2);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [getFrequencyData, height, isMuted, isPlaying, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`rounded-lg ${className}`}
      aria-label="Real-time Audio Spectrum Visualizer"
    />
  );
}

function drawRoundedBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
