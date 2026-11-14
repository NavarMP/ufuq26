'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Registration, CheckpointType, AttendeeCategory, GateScanLog } from '@/types';
import { parseScannedCode } from '@/lib/regCodeGenerator';
import { playGrantedSound, playWarningSound, playDeniedSound } from '@/lib/scannerAudio';
import { getActiveMealSlot, getAllMealSlots } from '@/lib/mealSlots';
import {
  Camera,
  Flashlight,
  FlashlightOff,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  UtensilsCrossed,
  DoorOpen,
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  ShieldCheck,
  User,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

interface GateScannerHUDProps {
  registrations: Registration[];
  onProcessScan: (params: {
    registration: Registration;
    checkpoint: CheckpointType;
    direction: 'in' | 'out' | 'verify_only';
    sessionContext?: string;
  }) => Promise<{
    resultStatus: 'granted' | 'warning' | 'denied';
    action: GateScanLog['action'];
    message: string;
    updatedRegistration: Registration;
  }>;
  onClose?: () => void;
  initialCheckpoint?: CheckpointType;
}

export default function GateScannerHUD({
  registrations,
  onProcessScan,
  onClose,
  initialCheckpoint = 'main_gate',
}: GateScannerHUDProps) {
  // Checkpoint & Mode State
  const [checkpoint, setCheckpoint] = useState<CheckpointType>(initialCheckpoint);
  const [gateDirection, setGateDirection] = useState<'auto' | 'in' | 'out'>('auto');
  const [activeMealSlotId, setActiveMealSlotId] = useState<string>(() => getActiveMealSlot().id);
  const [selectedSessionDay, setSelectedSessionDay] = useState<number>(1);

  // Scanner Hardware State
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Scan Processing Feedback State
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<{
    resultStatus: 'granted' | 'warning' | 'denied';
    action: string;
    message: string;
    registration?: Registration;
    timestamp: Date;
  } | null>(null);

  // Manual Input State
  const [manualQuery, setManualQuery] = useState('');
  const [manualSearching, setManualSearching] = useState(false);

  // Scanner instance ref & container ID
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'ufuq-camera-scanner-viewport';
  const lastScannedCodeRef = useRef<string>('');
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Dispatcher
  const triggerAudioFeedback = useCallback(
    (status: 'granted' | 'warning' | 'denied') => {
      if (!soundEnabled) return;
      if (status === 'granted') playGrantedSound();
      else if (status === 'warning') playWarningSound();
      else playDeniedSound();
    },
    [soundEnabled]
  );

  // Handle scanned code from camera or manual entry
  const handleScannedCode = useCallback(
    async (rawCode: string) => {
      if (isProcessing) return;

      const { code } = parseScannedCode(rawCode);
      if (!code) return;

      // Duplicate debounce check (prevent scanning same code twice within 3 seconds)
      if (lastScannedCodeRef.current === code) {
        return;
      }
      lastScannedCodeRef.current = code;
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => {
        lastScannedCodeRef.current = '';
      }, 2800);

      setIsProcessing(true);

      // Locate registration in memory
      const matched = registrations.find((r) => {
        const c = code.toUpperCase();
        return (
          (r.regCode || '').toUpperCase() === c ||
          (r.id || '').toUpperCase() === c ||
          (r.legacyId || '').toUpperCase() === c ||
          r.phone.replace(/\D/g, '').endsWith(c.replace(/\D/g, '').slice(-10))
        );
      });

      if (!matched) {
        triggerAudioFeedback('denied');
        setLastScanResult({
          resultStatus: 'denied',
          action: 'denied_invalid',
          message: `Unrecognized badge or phone: "${code}". No matching registration found.`,
          timestamp: new Date(),
        });
        setIsProcessing(false);
        return;
      }

      // Determine Direction
      let direction: 'in' | 'out' | 'verify_only' = 'in';
      if (checkpoint === 'main_gate') {
        if (gateDirection === 'auto') {
          // If currently inside, auto-toggle to out, else in
          direction = matched.gateStatus === 'inside' ? 'out' : 'in';
        } else {
          direction = gateDirection;
        }
      } else if (checkpoint === 'dining_hall' || checkpoint === 'auditorium') {
        direction = 'in';
      }

      // Session context string
      let sessionCtx: string | undefined = undefined;
      if (checkpoint === 'dining_hall') {
        sessionCtx = activeMealSlotId;
      } else if (checkpoint === 'auditorium') {
        sessionCtx = `day${selectedSessionDay}_keynote`;
      }

      try {
        const result = await onProcessScan({
          registration: matched,
          checkpoint,
          direction,
          sessionContext: sessionCtx,
        });

        triggerAudioFeedback(result.resultStatus);
        setLastScanResult({
          resultStatus: result.resultStatus,
          action: result.action,
          message: result.message,
          registration: result.updatedRegistration,
          timestamp: new Date(),
        });
      } catch (err: any) {
        triggerAudioFeedback('denied');
        setLastScanResult({
          resultStatus: 'denied',
          action: 'denied_invalid',
          message: err.message || 'Error recording scan record.',
          registration: matched,
          timestamp: new Date(),
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [
      isProcessing,
      registrations,
      checkpoint,
      gateDirection,
      activeMealSlotId,
      selectedSessionDay,
      onProcessScan,
      triggerAudioFeedback,
    ]
  );

  // Initialize Camera Scanner
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(containerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
          ],
          verbose: false,
        });
      }

      const qrScanner = scannerRef.current;
      if (qrScanner.isScanning) {
        await qrScanner.stop();
      }

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await qrScanner.start(
        { facingMode },
        config,
        (decodedText) => {
          handleScannedCode(decodedText);
        },
        () => {
          // Frame error (no QR detected in frame) - ignore
        }
      );

      setIsScanning(true);
      setHasCameraPermission(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError(
        err.message || 'Unable to access smartphone camera. Please check camera permissions.'
      );
      setHasCameraPermission(false);
      setIsScanning(false);
    }
  }, [facingMode, handleScannedCode]);

  // Stop Camera
  const stopCamera = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.warn('Camera stop error:', err);
      }
    }
  }, []);

  // Mount effect
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Toggle Torch / Flashlight
  const toggleTorch = async () => {
    if (!scannerRef.current || !isScanning) return;
    try {
      const nextTorch = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch } as any],
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle not supported on this device/lens:', err);
    }
  };

  // Switch Camera Lens (Front / Rear)
  const switchLens = () => {
    stopCamera().then(() => {
      setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    });
  };

  // Manual search submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;
    handleScannedCode(manualQuery.trim());
    setManualQuery('');
  };

  const mealSlots = getAllMealSlots();

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-4 sm:p-6 space-y-4 overflow-hidden bg-slate-950/95 text-white">
      {/* Header: Mode Selector & Close */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-clash text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
              <span>Smartphone Gate Scanner</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              High-throughput optical scanner HUD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
            title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* Close modal */}
          {onClose && (
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Checkpoint Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/40 border border-brand-gold/20 text-xs font-semibold">
        {/* 1. Main Gate */}
        <button
          type="button"
          onClick={() => setCheckpoint('main_gate')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            checkpoint === 'main_gate'
              ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DoorOpen className="w-3.5 h-3.5" />
          <span>Main Gate</span>
        </button>

        {/* 2. Dining Hall */}
        <button
          type="button"
          onClick={() => setCheckpoint('dining_hall')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            checkpoint === 'dining_hall'
              ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Dining Hall</span>
        </button>

        {/* 3. Auditorium Sessions */}
        <button
          type="button"
          onClick={() => setCheckpoint('auditorium')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            checkpoint === 'auditorium'
              ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sessions</span>
        </button>
      </div>

      {/* Sub-context selector depending on active checkpoint */}
      {checkpoint === 'main_gate' && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-brand-gold/15 text-xs">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-brand-gold" />
            Gate Mode:
          </span>
          <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-black/40 font-mono text-[11px]">
            <button
              onClick={() => setGateDirection('auto')}
              className={`px-2 py-1 rounded-md ${
                gateDirection === 'auto' ? 'bg-brand-gold text-brand-navy font-bold' : 'text-neutral-400'
              }`}
            >
              Auto-Toggle (In/Out)
            </button>
            <button
              onClick={() => setGateDirection('in')}
              className={`px-2 py-1 rounded-md ${
                gateDirection === 'in' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-neutral-400'
              }`}
            >
              Entry Only
            </button>
            <button
              onClick={() => setGateDirection('out')}
              className={`px-2 py-1 rounded-md ${
                gateDirection === 'out' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-neutral-400'
              }`}
            >
              Exit Only
            </button>
          </div>
        </div>
      )}

      {checkpoint === 'dining_hall' && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-brand-gold/15 text-xs">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-brand-gold" />
            Meal Slot:
          </span>
          <select
            value={activeMealSlotId}
            onChange={(e) => setActiveMealSlotId(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-black/70 border border-brand-gold/30 text-brand-gold font-mono text-[11px] focus:outline-none"
          >
            {mealSlots.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.label} ({s.startTime}–{s.endTime})
              </option>
            ))}
          </select>
        </div>
      )}

      {checkpoint === 'auditorium' && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-brand-gold/15 text-xs">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-gold" />
            Academic Day:
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedSessionDay(d)}
                className={`w-7 h-7 rounded-lg font-bold transition-all ${
                  selectedSessionDay === d
                    ? 'bg-brand-gold text-brand-navy shadow'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                D{d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          CAMERA SCANNER VIEWPORT HUD
         ======================================================== */}
      <div className="relative w-full aspect-square max-h-[340px] rounded-2xl overflow-hidden bg-black border-2 border-brand-gold/40 shadow-inner flex items-center justify-center">
        {/* HTML5 Qrcode Viewport element */}
        <div id={containerId} className="w-full h-full object-cover" />

        {/* Optical Scanning Laser Line & Corner Framing Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Corners */}
            <div className="flex justify-between">
              <div className="w-8 h-8 border-t-4 border-l-4 border-brand-gold rounded-tl-lg shadow-lg" />
              <div className="w-8 h-8 border-t-4 border-r-4 border-brand-gold rounded-tr-lg shadow-lg" />
            </div>

            {/* Pulsing Laser Scan Bar */}
            <div className="relative w-full h-0.5 bg-brand-gold shadow-[0_0_15px_#F59E0B] animate-pulse my-auto" />

            {/* Bottom Corners */}
            <div className="flex justify-between">
              <div className="w-8 h-8 border-b-4 border-l-4 border-brand-gold rounded-bl-lg shadow-lg" />
              <div className="w-8 h-8 border-b-4 border-r-4 border-brand-gold rounded-br-lg shadow-lg" />
            </div>
          </div>
        )}

        {/* Camera Permission or Init Error State */}
        {cameraError && (
          <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
            <p className="text-xs text-neutral-300 max-w-xs">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-all"
            >
              Retry Camera Permission
            </button>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold text-brand-navy font-bold text-xs animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Badge...</span>
            </div>
          </div>
        )}

        {/* Bottom Floating Camera Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
          {/* Torch toggle */}
          <button
            type="button"
            onClick={toggleTorch}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${
              torchOn
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-black/60 text-white hover:bg-black/80'
            }`}
            title="Toggle Flashlight / Torch"
          >
            {torchOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
          </button>

          {/* Facing mode lens toggle */}
          <button
            type="button"
            onClick={switchLens}
            className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 text-[11px] font-mono flex items-center gap-1.5 shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{facingMode === 'environment' ? 'Rear Lens' : 'Front Lens'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          LAST SCAN RESULT CARD OVERLAY (SENSORY FEEDBACK)
         ======================================================== */}
      {lastScanResult && (
        <div
          className={`p-4 rounded-2xl border-2 transition-all duration-300 animate-scale-in ${
            lastScanResult.resultStatus === 'granted'
              ? 'bg-emerald-950/70 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : lastScanResult.resultStatus === 'warning'
              ? 'bg-amber-950/70 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-rose-950/70 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {lastScanResult.resultStatus === 'granted' ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : lastScanResult.resultStatus === 'warning' ? (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    lastScanResult.resultStatus === 'granted'
                      ? 'text-emerald-400'
                      : lastScanResult.resultStatus === 'warning'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {lastScanResult.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {lastScanResult.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {lastScanResult.registration && (
                <div>
                  <h4 className="font-clash text-base font-bold text-white">
                    {lastScanResult.registration.fullName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono mt-0.5">
                    <span className="text-brand-gold font-bold">
                      {lastScanResult.registration.regCode || lastScanResult.registration.id}
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      {lastScanResult.registration.darsRegNo || 'SDC'}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-neutral-200 pt-0.5 font-medium">
                {lastScanResult.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MANUAL ENTRY FALLBACK INPUT
         ======================================================== */}
      <form onSubmit={handleManualSubmit} className="pt-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="Type Reg Code (UF26-...) or 10-digit Phone..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/50 border border-brand-gold/30 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-xs font-mono text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!manualQuery.trim()}
          className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow transition-all disabled:opacity-40"
        >
          Check In
        </button>
      </form>
    </div>
  );
}
