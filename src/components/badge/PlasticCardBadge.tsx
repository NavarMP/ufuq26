'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { Registration } from '@/types';
import { ensureRegistrationCode, encodeQRPayload } from '@/lib/regCodeGenerator';
import {
  Printer,
  Copy,
  Check,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Wifi,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Lock,
} from 'lucide-react';

interface PlasticCardBadgeProps {
  registration: Registration;
  orientation?: 'portrait' | 'landscape';
  showControls?: boolean;
  onPrint?: () => void;
  className?: string;
}

export default function PlasticCardBadge({
  registration,
  orientation: initialOrientation = 'portrait',
  showControls = true,
  onPrint,
  className = '',
}: PlasticCardBadgeProps) {
  const reg = ensureRegistrationCode(registration);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(initialOrientation);
  const [activeFace, setActiveFace] = useState<'front' | 'back'>('front');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  // Generate QR Code
  useEffect(() => {
    let isMounted = true;
    const payload = encodeQRPayload(reg);
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 240,
      color: {
        dark: '#0B132B',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => console.error('QR code generation error:', err));

    return () => {
      isMounted = false;
    };
  }, [reg]);

  // Generate Code 128 Barcode
  useEffect(() => {
    if (barcodeRef.current && reg.regCode) {
      try {
        JsBarcode(barcodeRef.current, reg.regCode, {
          format: 'CODE128',
          width: 1.2,
          height: 28,
          displayValue: false,
          margin: 0,
          background: 'transparent',
          lineColor: '#0B132B',
        });
      } catch (err) {
        console.warn('Barcode render issue:', err);
      }
    }
  }, [reg.regCode, activeFace, orientation]);

  const handleCopyCode = () => {
    if (!reg.regCode) return;
    navigator.clipboard.writeText(reg.regCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleNativePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    window.print();
  };

  // Category Theme Badges
  const getCategoryTheme = () => {
    switch (reg.category) {
      case 'vip':
        return {
          pillBg: 'bg-amber-500 text-slate-950 border-amber-300',
          gradient: 'from-amber-500/20 via-brand-gold/10 to-transparent',
          label: 'VIP DIGNITARY',
        };
      case 'faculty':
        return {
          pillBg: 'bg-emerald-600 text-white border-emerald-400',
          gradient: 'from-emerald-500/20 via-brand-gold/10 to-transparent',
          label: 'FACULTY MUDARRIS',
        };
      case 'organizer':
        return {
          pillBg: 'bg-indigo-600 text-white border-indigo-400',
          gradient: 'from-indigo-500/20 via-brand-gold/10 to-transparent',
          label: 'ADSA ORGANIZER',
        };
      case 'volunteer':
        return {
          pillBg: 'bg-cyan-600 text-white border-cyan-400',
          gradient: 'from-cyan-500/20 via-brand-gold/10 to-transparent',
          label: 'CAMP VOLUNTEER',
        };
      case 'scholar':
      default:
        return {
          pillBg: 'bg-brand-gold text-brand-navy border-amber-300',
          gradient: 'from-brand-gold/20 via-emerald-500/10 to-transparent',
          label: 'GRADUATING SCHOLAR',
        };
    }
  };

  const theme = getCategoryTheme();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Action Controls Bar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 p-1.5 rounded-2xl glass-panel border border-brand-gold/25 text-xs print:hidden">
          <button
            type="button"
            onClick={() => setActiveFace(activeFace === 'front' ? 'back' : 'front')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/40 hover:bg-brand-gold/20 text-neutral-800 dark:text-neutral-200 transition-colors font-medium"
          >
            <RotateCw className="w-3.5 h-3.5 text-brand-gold" />
            <span>Flip to {activeFace === 'front' ? 'Back' : 'Front'}</span>
          </button>

          <button
            type="button"
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/40 hover:bg-brand-gold/20 text-neutral-800 dark:text-neutral-200 transition-colors font-medium"
          >
            <span>Switch to {orientation === 'portrait' ? 'Landscape' : 'Portrait'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/40 hover:bg-brand-gold/20 text-neutral-800 dark:text-neutral-200 transition-colors font-medium"
            title="Copy Registration Code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-brand-gold" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleNativePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-gold text-brand-navy hover:bg-brand-gold-hover font-bold transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Plastic Card</span>
          </button>
        </div>
      )}

      {/* ============================================================
          CR80 PLASTIC CARD CONTAINER
          CR80 dimensions: 85.6mm x 54mm (Ratio: ~1.585)
          In screen pixels:
          Portrait: 320px x 507px (~54mm x 85.6mm)
          Landscape: 507px x 320px (~85.6mm x 54mm)
         ============================================================ */}
      <div
        id="plastic-card-printable"
        className={`relative overflow-hidden rounded-[20px] shadow-2xl border-2 border-brand-gold/60 select-none transition-all duration-300 print:shadow-none print:border-black ${
          orientation === 'portrait'
            ? 'w-[320px] h-[507px] min-w-[320px] min-h-[507px]'
            : 'w-[507px] h-[320px] min-w-[507px] min-h-[320px]'
        } bg-gradient-to-br from-[#0F172A] via-[#0B132B] to-[#041E19] text-white`}
      >
        {/* Holographic Security Sheen / Guilloche Pattern Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.5),transparent_60%)]" />
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-brand-gold/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        {/* ========================================================
            CARD FRONT FACE (PORTRAIT)
           ======================================================== */}
        {activeFace === 'front' && orientation === 'portrait' && (
          <div className="relative h-full flex flex-col justify-between p-5">
            {/* Header: Brand & Arabic Calligraphy */}
            <div className="text-center space-y-1 border-b border-brand-gold/25 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-brand-gold uppercase font-semibold">
                  ADSA • SUFFA DARS
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-bold">
                  DEC 2026
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="font-arabic text-2xl font-bold text-brand-gold tracking-wide">
                  أُفُق ٢٠٢٦
                </span>
                <span className="font-clash text-xl font-black tracking-tight text-white">
                  UFUQ &apos;26
                </span>
              </div>
              <p className="text-[9px] text-neutral-300 tracking-wider uppercase font-medium">
                Scholars Residential Graduation Camp
              </p>
            </div>

            {/* Middle Section: Attendee Information & Category */}
            <div className="text-center space-y-2.5 my-auto py-1">
              {/* Category Ribbon */}
              <div className="inline-block">
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-extrabold tracking-wider border shadow-sm ${theme.pillBg}`}
                >
                  {theme.label}
                </span>
              </div>

              {/* Attendee Name */}
              <div className="space-y-0.5">
                <h3 className="font-clash text-xl font-bold text-white tracking-wide line-clamp-2 px-2 leading-snug">
                  {reg.fullName}
                </h3>
                <p className="text-[11px] font-mono text-brand-gold font-bold tracking-wider">
                  {reg.regCode}
                </p>
              </div>

              {/* Dars Institution Info */}
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-brand-gold/20 text-left">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                  <Building2 className="w-3 h-3 text-brand-gold shrink-0" />
                  <span className="font-semibold text-brand-gold font-mono">
                    {reg.darsRegNo || 'SDC'}
                  </span>
                  <span className="truncate text-neutral-200">
                    {reg.darsName || 'SUFFA Dars Coordination'}
                  </span>
                </div>
                {reg.darsMudarris && (
                  <p className="text-[9px] text-neutral-400 pl-4 truncate mt-0.5">
                    Mudarris: {reg.darsMudarris}
                  </p>
                )}
              </div>
            </div>

            {/* QR Code & Code 128 Laser Barcode */}
            <div className="pt-2 border-t border-brand-gold/25 flex flex-col items-center gap-2">
              <div className="flex items-center gap-3 w-full justify-between px-1">
                {/* QR Code Box */}
                <div className="p-1 rounded-xl bg-white shadow-md border border-brand-gold/50 flex-shrink-0">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt={`QR Code for ${reg.regCode}`}
                      className="w-[84px] h-[84px] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-[84px] h-[84px] flex items-center justify-center bg-neutral-200 text-neutral-500 text-[9px]">
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* Card Meta & Anti-counterfeit Seal */}
                <div className="text-right space-y-1 text-[10px] flex-1">
                  <div className="flex items-center justify-end gap-1 text-emerald-400 font-mono font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFIED ADMISSION</span>
                  </div>
                  <p className="text-neutral-400 text-[9px]">
                    Alathurpadi Dars Campus<br />
                    Malappuram, Kerala
                  </p>
                  <p className="font-mono text-[9px] text-brand-gold">
                    Emergency: +91 90745 25205
                  </p>
                </div>
              </div>

              {/* Code 128 Barcode for Laser Guns */}
              <div className="w-full flex justify-center bg-white px-2 py-0.5 rounded-md shadow-sm">
                <svg ref={barcodeRef} className="w-full max-h-[26px]" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD BACK FACE (PORTRAIT)
           ======================================================== */}
        {activeFace === 'back' && orientation === 'portrait' && (
          <div className="relative h-full flex flex-col justify-between p-5 bg-gradient-to-b from-[#0F172A] via-[#091026] to-[#041E19]">
            {/* Header */}
            <div className="text-center border-b border-brand-gold/20 pb-2">
              <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
                UFUQ &apos;26 RESIDENTIAL ACCREDITATION
              </span>
              <p className="text-[9px] text-neutral-400">Official Access Card • Camp Credentials</p>
            </div>

            {/* Essential Guidelines & Camp Rules */}
            <div className="space-y-3 text-[10px] my-auto">
              {/* Wi-Fi & Connectivity */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-brand-gold/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-brand-gold" />
                  <div>
                    <span className="block font-semibold text-white">Campus Wi-Fi</span>
                    <span className="text-[9px] text-neutral-400">SSID: UFUQ26-CAMPUS</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-brand-gold px-2 py-0.5 rounded bg-brand-gold/15 text-[10px]">
                  adsa@2026
                </span>
              </div>

              {/* Dining & Routine Hours */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-brand-gold/20 space-y-1.5">
                <span className="block font-semibold text-brand-gold text-[10px]">Dining & Gathering Timings:</span>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-neutral-300">
                  <div>☕ Breakfast: 07:30–09:30</div>
                  <div>🍛 Lunch: 12:30–15:00</div>
                  <div>🍵 Evening Tea: 16:30–17:45</div>
                  <div>🍲 Dinner: 19:45–22:00</div>
                </div>
              </div>

              {/* Regulations */}
              <div className="space-y-1 text-[9px] text-neutral-400 leading-relaxed px-1">
                <p>1. This card must be worn visibly around the campus at all times.</p>
                <p>2. Mandatory check-in required at main gates, dining hall, and keynote halls.</p>
                <p>3. Non-transferable. Misuse results in immediate accreditation revocation.</p>
              </div>
            </div>

            {/* Footer Support */}
            <div className="pt-2 border-t border-brand-gold/20 text-center space-y-1">
              <div className="flex items-center justify-center gap-3 text-[9px] text-neutral-300 font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-gold" />
                  +91 90745 25205
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-gold" />
                  Alathurpadi Campus
                </span>
              </div>
              <p className="text-[8px] text-neutral-500 font-mono">
                Issued by All Kerala Dars Students Association (ADSA)
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD FRONT FACE (LANDSCAPE)
           ======================================================== */}
        {activeFace === 'front' && orientation === 'landscape' && (
          <div className="relative h-full flex items-center justify-between p-5 gap-4">
            {/* Left Column: Attendee & Dars Info */}
            <div className="flex-1 flex flex-col justify-between h-full">
              <div className="space-y-1 border-b border-brand-gold/25 pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-arabic text-lg font-bold text-brand-gold">أُفُق ٢٠٢٦</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${theme.pillBg}`}
                  >
                    {theme.label}
                  </span>
                </div>
                <h4 className="font-clash text-lg font-black text-white">UFUQ &apos;26 RESIDENTIAL CAMP</h4>
              </div>

              <div className="my-auto space-y-1">
                <h3 className="font-clash text-lg font-bold text-white line-clamp-1">{reg.fullName}</h3>
                <p className="font-mono text-xs font-bold text-brand-gold">{reg.regCode}</p>
                <p className="text-[10px] text-neutral-300 truncate">
                  {reg.darsRegNo ? `[${reg.darsRegNo}] ` : ''}{reg.darsName || 'SUFFA Dars'}
                </p>
              </div>

              <div className="w-full bg-white px-2 py-0.5 rounded shadow-sm">
                <svg ref={barcodeRef} className="w-full max-h-[22px]" />
              </div>
            </div>

            {/* Right Column: QR Code & Security Stamp */}
            <div className="w-36 flex flex-col items-center justify-between h-full pl-4 border-l border-brand-gold/25 text-center">
              <span className="text-[9px] font-mono text-brand-gold uppercase tracking-wider font-semibold">
                CAMP ACCESS PASS
              </span>
              <div className="p-1 rounded-xl bg-white shadow-md border border-brand-gold/50 my-auto">
                {qrDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${reg.regCode}`}
                    className="w-[96px] h-[96px] object-contain rounded-lg"
                  />
                )}
              </div>
              <div className="text-[8px] text-neutral-400 font-mono">
                DEC 24–30, 2026<br />Alathurpadi Campus
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CARD BACK FACE (LANDSCAPE)
           ======================================================== */}
        {activeFace === 'back' && orientation === 'landscape' && (
          <div className="relative h-full flex flex-col justify-between p-5 text-xs">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-2">
              <span className="font-clash font-bold text-white text-sm">CAMP REGULATIONS &amp; PROTOCOL</span>
              <span className="text-[10px] font-mono text-brand-gold">SSID: UFUQ26-CAMPUS (adsa@2026)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] text-neutral-300 my-auto">
              <div className="space-y-1">
                <span className="font-bold text-brand-gold block">Dining Hours:</span>
                <p>• Breakfast: 07:30–09:30</p>
                <p>• Lunch: 12:30–15:00</p>
                <p>• Dinner: 19:45–22:00</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-brand-gold block">Security Notice:</span>
                <p>• Wear card visibly at all checkpoints.</p>
                <p>• Meals claimed via single-scan QR.</p>
                <p>• Lost card helpline: +91 90745 25205</p>
              </div>
            </div>

            <div className="pt-2 border-t border-brand-gold/20 flex justify-between text-[9px] text-neutral-400 font-mono">
              <span>Alathurpadi Dars Campus, Malappuram</span>
              <span>All Kerala Dars Students Association (ADSA)</span>
            </div>
          </div>
        )}
      </div>

      {/* Global Print Style for Exact CR80 Sizing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #plastic-card-printable,
          #plastic-card-printable * {
            visibility: visible !important;
          }
          #plastic-card-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
