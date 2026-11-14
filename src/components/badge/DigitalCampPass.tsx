'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Registration } from '@/types';
import { ensureRegistrationCode, encodeQRPayload } from '@/lib/regCodeGenerator';
import {
  RotateCw,
  Copy,
  Check,
  ShieldCheck,
  Wifi,
  Phone,
  Printer,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  CircleDot,
  UtensilsCrossed,
  BookOpen,
  Home,
} from 'lucide-react';

interface DigitalCampPassProps {
  registration: Registration;
  onOpenPrintModal?: () => void;
  className?: string;
}

export default function DigitalCampPass({
  registration,
  onOpenPrintModal,
  className = '',
}: DigitalCampPassProps) {
  const reg = ensureRegistrationCode(registration);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');

  // 3D Tilt perspective states
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let isMounted = true;
    const payload = encodeQRPayload(reg);
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 260,
      color: {
        dark: '#0B132B',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) setQrUrl(url);
      })
      .catch((err) => console.error('QR code generation failed:', err));

    return () => {
      isMounted = false;
    };
  }, [reg]);

  // Handle Mouse Tilt on Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12; // tilt angle
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  const handleCopy = () => {
    if (!reg.regCode) return;
    navigator.clipboard.writeText(reg.regCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine gate status display
  const isInside = reg.gateStatus === 'inside';

  return (
    <div className={`flex flex-col items-center max-w-sm mx-auto select-none ${className}`}>
      {/* 3D Perspective Card Wrapper */}
      <div
        className="w-full perspective-1000 py-3"
        style={{ perspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
          }}
          className="relative w-full aspect-[1/1.58] rounded-[28px] cursor-pointer shadow-2xl border border-brand-gold/50 bg-gradient-to-br from-[#0B132B] via-[#091522] to-[#04241D] text-white p-6 flex flex-col justify-between overflow-hidden"
        >
          {/* Holographic Dynamic Glare Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.15) 30%, transparent 65%)`,
              opacity: 0.8,
            }}
          />

          {/* Background Watermark Calligraphy */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none font-arabic text-8xl text-brand-gold select-none">
            أُفُق
          </div>

          {/* FRONT FACE CONTENT */}
          {!isFlipped ? (
            <div className="relative z-10 h-full flex flex-col justify-between">
              {/* Header: Brand & Live Gate Status */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-brand-gold/20">
                  <div className="flex items-center gap-1.5">
                    <span className="font-arabic text-lg font-bold text-brand-gold">أُفُق ٢٠٢٦</span>
                    <span className="font-clash text-xs font-black tracking-wider text-white">UFUQ &apos;26</span>
                  </div>

                  {/* Live Campus Gate Status Pill */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-sm border ${
                      isInside
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isInside ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                      }`}
                    />
                    <span>{isInside ? 'INSIDE CAMPUS' : 'OUTSIDE VENUE'}</span>
                  </div>
                </div>

                {/* Registration Code & Category */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold tracking-wider bg-brand-gold text-brand-navy">
                    {reg.category?.toUpperCase() || 'GRADUATING SCHOLAR'}
                  </span>
                  <span className="font-mono text-xs font-bold text-brand-gold tracking-wide">
                    {reg.regCode}
                  </span>
                </div>
              </div>

              {/* Scholar Name & Dars Institution */}
              <div className="my-auto py-2 text-center space-y-1">
                <h3 className="font-clash text-xl font-bold text-white tracking-wide line-clamp-2">
                  {reg.fullName}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-300">
                  <Building2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span className="truncate">{reg.darsName || 'SUFFA Dars Coordination'}</span>
                </div>
                {reg.darsMudarris && (
                  <p className="text-[11px] text-neutral-400">
                    Mudarris: {reg.darsMudarris}
                  </p>
                )}
              </div>

              {/* QR Code Container */}
              <div className="pt-2 border-t border-brand-gold/25 flex items-center justify-between gap-3">
                <div className="p-1 rounded-2xl bg-white shadow-xl border-2 border-brand-gold/60">
                  {qrUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrUrl}
                      alt="Digital Camp Pass QR"
                      className="w-20 h-20 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center text-[9px] text-neutral-500">
                      Generating...
                    </div>
                  )}
                </div>

                {/* Metrics: Sessions & Meals Claimed */}
                <div className="flex-1 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                      <BookOpen className="w-3 h-3 text-brand-gold" />
                      Sessions:
                    </span>
                    <span className="font-mono font-bold text-brand-gold">
                      {reg.attendedSessions?.length || 0}/7 Attended
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                      <UtensilsCrossed className="w-3 h-3 text-emerald-400" />
                      Meals:
                    </span>
                    <span className="font-mono font-bold text-emerald-300">
                      {Object.keys(reg.claimedMeals || {}).length} Claimed
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-end gap-1 text-[10px] text-neutral-400">
                    <RotateCw className="w-3 h-3 text-brand-gold animate-spin-slow" />
                    <span>Tap card to flip</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* BACK FACE CONTENT */
            <div
              className="relative z-10 h-full flex flex-col justify-between"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-brand-gold/20">
                  <span className="font-clash text-xs font-bold text-brand-gold tracking-wide">
                    CAMP PROTOCOL &amp; DETAILS
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Alathurpadi Campus</span>
                </div>

                {/* Accommodation Details */}
                <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-brand-gold/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-brand-gold" />
                      Hostel Allotment:
                    </span>
                    <span className="font-semibold text-white">
                      {reg.hostelRoom || 'Block A (Main Dars Campus)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-brand-gold" />
                      Wi-Fi SSID:
                    </span>
                    <span className="font-mono font-bold text-brand-gold">
                      UFUQ26-CAMPUS
                    </span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="space-y-1.5 text-[10px] text-neutral-300 my-auto leading-relaxed px-1">
                <p>• Digital Pass must be scanned at Main Gates, Keynotes, and Dining Hall.</p>
                <p>• Meals are redeemed once per designated time slot.</p>
                <p>• For emergency medical assistance or security, contact camp control room.</p>
              </div>

              {/* Emergency Footer */}
              <div className="pt-2 border-t border-brand-gold/25 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-brand-gold" />
                    Helpline:
                  </span>
                  <a
                    href="tel:+919074525205"
                    className="text-brand-gold hover:underline font-bold"
                  >
                    +91 90745 25205
                  </a>
                </div>
                <p className="text-[9px] text-center text-neutral-500 font-mono">
                  All Kerala Dars Students Association • Tap to flip front
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Below Pass */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 w-full">
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-brand-gold/25 hover:border-brand-gold text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-brand-gold" />
          <span>Flip Card</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-brand-gold/25 hover:border-brand-gold text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-brand-gold" />}
          <span>{copied ? 'Copied' : 'Copy ID'}</span>
        </button>

        {onOpenPrintModal && (
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Plastic Card</span>
          </button>
        )}
      </div>
    </div>
  );
}
