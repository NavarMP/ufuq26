'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Check, Copy } from 'lucide-react';
import { useShare } from '@/hooks/useShare';
import { useApp } from '@/context/AppContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import toast from 'react-hot-toast';

interface QRCodeViewProps {
  url?: string;
  className?: string;
}

export default function QRCodeView({ url, className = '' }: QRCodeViewProps) {
  const { payload } = useShare();
  const { t } = useApp();
  const { triggerSuccess } = useHapticFeedback();
  const { playSuccessChime } = useAudioFeedback();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const targetUrl = url || payload.url;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Render QR Code with error correction level 'H' (High - 30% recovery) so center logo doesn't disrupt scan
    QRCode.toCanvas(
      canvas,
      targetUrl,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#101d32',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (err) => {
        if (err) {
          console.error('Error generating QR Code', err);
          return;
        }

        // Overlay central emblem
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 300;
        const logoSize = 64;
        const center = size / 2;

        // Circular background shield for logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, logoSize / 2 + 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#c9a45c';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(center, center, logoSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#101d32';
        ctx.fill();

        // Draw UFUQ logo image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/images/UFUQ-Logo.svg';
        img.onload = () => {
          ctx.drawImage(img, center - logoSize / 2 + 8, center - logoSize / 2 + 8, logoSize - 16, logoSize - 16);
          ctx.restore();
        };
        img.onerror = () => {
          // Fallback: draw gold text
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#c9a45c';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('أُفُق', center, center);
          ctx.restore();
        };
      }
    );
  }, [targetUrl]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloading(true);
    triggerSuccess();
    playSuccessChime();

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `UFUQ26-QRCode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('QR Code downloaded!');
    } catch {
      toast.error('Failed to download QR code');
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
        toast.success(t('share.story.copiedImage') || 'QR Code copied to clipboard!');
        setTimeout(() => setCopiedImage(false), 2000);
      });
    } catch {
      toast.error('Direct copy not supported on this device. Use download instead.');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 space-y-4 text-center ${className}`}>
      {/* QR Canvas Container with Card Border */}
      <div className="relative p-3.5 rounded-3xl bg-white shadow-xl shadow-brand-navy/10 border-2 border-brand-gold/40">
        <canvas ref={canvasRef} className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl block" />
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-navy text-[10px] font-bold text-brand-gold tracking-wider uppercase border border-brand-gold/40 shadow">
          UFUQ ’26
        </div>
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed">
        {t('share.qr.scanHint') || 'Scan with any smartphone camera to visit the camp page instantly'}
      </p>

      {/* QR Code Action Buttons */}
      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy hover:bg-brand-gold-hover text-xs font-bold shadow-md shadow-brand-gold/20 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? 'Saving...' : t('share.qr.download') || 'Download QR'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyImage}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all active:scale-95"
        >
          {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-brand-gold" />}
          <span>{copiedImage ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
