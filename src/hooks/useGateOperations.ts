'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Registration, GateScanLog, CheckpointType } from '@/types';
import { useEvent } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const STORAGE_KEYS = {
  GATE_SCANS: 'ufuq_gate_scans_v1',
};

export function useGateOperations() {
  const { registrations, updateRegistration } = useEvent();
  const { user } = useAuth();
  const [scanLogs, setScanLogs] = useState<GateScanLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Load scan logs from localStorage first, then sync from Firestore
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const local = localStorage.getItem(STORAGE_KEYS.GATE_SCANS);
      if (local) {
        setScanLogs(JSON.parse(local));
      }
    } catch (err) {
      console.warn('Error reading local gate scans', err);
    } finally {
      setIsLoadingLogs(false);
    }

    // Attempt Firestore sync for recent scans
    const fetchRemoteScans = async () => {
      try {
        const q = query(collection(db, 'gate_scans'), orderBy('scannedAt', 'desc'), limit(150));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remoteLogs: GateScanLog[] = [];
          snap.forEach((d) => remoteLogs.push(d.data() as GateScanLog));
          setScanLogs(remoteLogs);
          localStorage.setItem(STORAGE_KEYS.GATE_SCANS, JSON.stringify(remoteLogs));
        }
      } catch (err) {
        // Firestore may be offline or rules restricted; local cache will remain
        console.warn('Firestore gate_scans fetch note:', err);
      }
    };

    fetchRemoteScans();
  }, []);

  // Persist scan log
  const recordLog = useCallback(
    async (log: GateScanLog) => {
      setScanLogs((prev) => {
        const updated = [log, ...prev].slice(0, 500); // keep top 500
        try {
          localStorage.setItem(STORAGE_KEYS.GATE_SCANS, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Async write to Firestore
      try {
        await setDoc(doc(db, 'gate_scans', log.id), log);
      } catch (err) {
        console.warn('Firestore gate_scans setDoc note:', err);
      }
    },
    []
  );

  /**
   * Main scan processor for all checkpoints:
   * 1. Main Gate (In/Out & Anti-passback)
   * 2. Dining Hall (Single redemption per meal slot)
   * 3. Auditorium (Session attendance tracking)
   */
  const processScan = useCallback(
    async (params: {
      registration: Registration;
      checkpoint: CheckpointType;
      direction: 'in' | 'out' | 'verify_only';
      sessionContext?: string;
    }): Promise<{
      resultStatus: 'granted' | 'warning' | 'denied';
      action: GateScanLog['action'];
      message: string;
      updatedRegistration: Registration;
    }> => {
      const { registration: reg, checkpoint, direction, sessionContext } = params;
      const now = new Date();
      const nowIso = now.toISOString();
      const scanId = `SCAN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const operatorUid = user?.uid || 'volunteer-gate';
      const operatorName = user?.displayName || user?.email || 'Gate Volunteer';

      // ========================================================
      // 1. DINING HALL CHECKPOINT (MEAL TOKENS)
      // ========================================================
      if (checkpoint === 'dining_hall') {
        const mealSlotKey = sessionContext || 'day1_lunch';
        const alreadyClaimedTime = reg.claimedMeals?.[mealSlotKey];

        if (alreadyClaimedTime) {
          const claimedDate = new Date(alreadyClaimedTime);
          const timeFormatted = claimedDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const log: GateScanLog = {
            id: scanId,
            registrationId: reg.id,
            regCode: reg.regCode || reg.id,
            attendeeName: reg.fullName,
            darsRegNo: reg.darsRegNo,
            darsName: reg.darsName,
            category: reg.category || 'scholar',
            checkpoint: 'dining_hall',
            direction: 'in',
            action: 'denied_duplicate',
            resultStatus: 'denied',
            message: `Meal already claimed today at ${timeFormatted}. Single voucher policy.`,
            scannedAt: nowIso,
            scannedByUid: operatorUid,
            scannedByName: operatorName,
            deviceType: 'camera',
            sessionContext: mealSlotKey,
          };
          await recordLog(log);

          return {
            resultStatus: 'denied',
            action: 'denied_duplicate',
            message: `Meal already claimed at ${timeFormatted}. Only 1 meal allowed per attendee.`,
            updatedRegistration: reg,
          };
        }

        // Redeem Meal Voucher
        const updatedMeals = {
          ...(reg.claimedMeals || {}),
          [mealSlotKey]: nowIso,
        };

        const updatedReg: Registration = {
          ...reg,
          claimedMeals: updatedMeals,
          lastScannedAt: nowIso,
          lastCheckpoint: 'dining_hall',
        };

        await updateRegistration(reg.id, {
          claimedMeals: updatedMeals,
          lastScannedAt: nowIso,
          lastCheckpoint: 'dining_hall',
        });

        const log: GateScanLog = {
          id: scanId,
          registrationId: reg.id,
          regCode: reg.regCode || reg.id,
          attendeeName: reg.fullName,
          darsRegNo: reg.darsRegNo,
          darsName: reg.darsName,
          category: reg.category || 'scholar',
          checkpoint: 'dining_hall',
          direction: 'in',
          action: 'meal_claimed',
          resultStatus: 'granted',
          message: `Meal successfully redeemed for ${mealSlotKey.replace(/_/g, ' ').toUpperCase()}.`,
          scannedAt: nowIso,
          scannedByUid: operatorUid,
          scannedByName: operatorName,
          deviceType: 'camera',
          sessionContext: mealSlotKey,
        };
        await recordLog(log);

        return {
          resultStatus: 'granted',
          action: 'meal_claimed',
          message: `Meal voucher verified & redeemed. Enjoy the feast!`,
          updatedRegistration: updatedReg,
        };
      }

      // ========================================================
      // 2. AUDITORIUM CHECKPOINT (ACADEMIC SESSIONS)
      // ========================================================
      if (checkpoint === 'auditorium') {
        const sessionKey = sessionContext || 'session_general';
        const alreadyAttended = reg.attendedSessions?.includes(sessionKey);

        if (alreadyAttended) {
          const log: GateScanLog = {
            id: scanId,
            registrationId: reg.id,
            regCode: reg.regCode || reg.id,
            attendeeName: reg.fullName,
            darsRegNo: reg.darsRegNo,
            darsName: reg.darsName,
            category: reg.category || 'scholar',
            checkpoint: 'auditorium',
            direction: 'in',
            action: 'denied_duplicate',
            resultStatus: 'warning',
            message: `Scholar attendance already recorded for ${sessionKey}. Re-entry authorized.`,
            scannedAt: nowIso,
            scannedByUid: operatorUid,
            scannedByName: operatorName,
            deviceType: 'camera',
            sessionContext: sessionKey,
          };
          await recordLog(log);

          return {
            resultStatus: 'warning',
            action: 'denied_duplicate',
            message: `Attendance already recorded for this session. Re-entry granted.`,
            updatedRegistration: reg,
          };
        }

        const updatedSessions = [...(reg.attendedSessions || []), sessionKey];
        const updatedReg: Registration = {
          ...reg,
          attendedSessions: updatedSessions,
          lastScannedAt: nowIso,
          lastCheckpoint: 'auditorium',
        };

        await updateRegistration(reg.id, {
          attendedSessions: updatedSessions,
          lastScannedAt: nowIso,
          lastCheckpoint: 'auditorium',
        });

        const log: GateScanLog = {
          id: scanId,
          registrationId: reg.id,
          regCode: reg.regCode || reg.id,
          attendeeName: reg.fullName,
          darsRegNo: reg.darsRegNo,
          darsName: reg.darsName,
          category: reg.category || 'scholar',
          checkpoint: 'auditorium',
          direction: 'in',
          action: 'session_marked',
          resultStatus: 'granted',
          message: `Session check-in verified. Attendance logged toward Graduation Honors.`,
          scannedAt: nowIso,
          scannedByUid: operatorUid,
          scannedByName: operatorName,
          deviceType: 'camera',
          sessionContext: sessionKey,
        };
        await recordLog(log);

        return {
          resultStatus: 'granted',
          action: 'session_marked',
          message: `Keynote session attendance marked (${updatedSessions.length}/7 completed).`,
          updatedRegistration: updatedReg,
        };
      }

      // ========================================================
      // 3. MAIN GATE CHECKPOINT (IN / OUT CAMPUS ACCESS CONTROL)
      // ========================================================
      const isCurrentlyInside = reg.gateStatus === 'inside';

      // Anti-Passback warning: if scanned IN while already recorded INSIDE within last 10 minutes
      if (direction === 'in' && isCurrentlyInside && reg.lastScannedAt) {
        const diffMs = now.getTime() - new Date(reg.lastScannedAt).getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 10) {
          const log: GateScanLog = {
            id: scanId,
            registrationId: reg.id,
            regCode: reg.regCode || reg.id,
            attendeeName: reg.fullName,
            darsRegNo: reg.darsRegNo,
            darsName: reg.darsName,
            category: reg.category || 'scholar',
            checkpoint: 'main_gate',
            direction: 'in',
            action: 'denied_duplicate',
            resultStatus: 'warning',
            message: `Passback Notice: Attendee was already recorded INSIDE campus ${diffMin} min ago. Re-entry logged.`,
            scannedAt: nowIso,
            scannedByUid: operatorUid,
            scannedByName: operatorName,
            deviceType: 'camera',
          };
          await recordLog(log);

          return {
            resultStatus: 'warning',
            action: 'denied_duplicate',
            message: `Already marked INSIDE ${diffMin}m ago. Gate pass re-verified.`,
            updatedRegistration: reg,
          };
        }
      }

      // Record Entry or Exit
      const newGateStatus = direction === 'in' ? 'inside' : 'outside';
      const actionType = direction === 'in' ? 'entry_allowed' : 'exit_recorded';
      const newTotalEntries = (reg.totalCampusEntries || 0) + (direction === 'in' ? 1 : 0);

      const updatedReg: Registration = {
        ...reg,
        gateStatus: newGateStatus,
        lastScannedAt: nowIso,
        lastCheckpoint: 'main_gate',
        lastScannedBy: operatorName,
        totalCampusEntries: newTotalEntries,
      };

      await updateRegistration(reg.id, {
        gateStatus: newGateStatus,
        lastScannedAt: nowIso,
        lastCheckpoint: 'main_gate',
        lastScannedBy: operatorName,
        totalCampusEntries: newTotalEntries,
      });

      const logMsg =
        direction === 'in'
          ? `Welcome to Alathurpadi Campus! Entry granted to ${reg.fullName}.`
          : `Exit recorded for ${reg.fullName}. See you back soon!`;

      const log: GateScanLog = {
        id: scanId,
        registrationId: reg.id,
        regCode: reg.regCode || reg.id,
        attendeeName: reg.fullName,
        darsRegNo: reg.darsRegNo,
        darsName: reg.darsName,
        category: reg.category || 'scholar',
        checkpoint: 'main_gate',
        direction,
        action: actionType,
        resultStatus: 'granted',
        message: logMsg,
        scannedAt: nowIso,
        scannedByUid: operatorUid,
        scannedByName: operatorName,
        deviceType: 'camera',
      };
      await recordLog(log);

      return {
        resultStatus: 'granted',
        action: actionType,
        message: logMsg,
        updatedRegistration: updatedReg,
      };
    },
    [user, recordLog, updateRegistration]
  );

  // Live Aggregated Metrics
  const stats = useMemo(() => {
    let insideCount = 0;
    let outsideCount = 0;
    let totalMealsClaimed = 0;
    let todayScans = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    registrations.forEach((r) => {
      if (r.gateStatus === 'inside') insideCount++;
      else outsideCount++;

      if (r.claimedMeals) {
        totalMealsClaimed += Object.keys(r.claimedMeals).length;
      }
    });

    scanLogs.forEach((l) => {
      if (l.scannedAt && l.scannedAt.startsWith(todayStr)) {
        todayScans++;
      }
    });

    return {
      insideCount,
      outsideCount,
      totalAttendees: registrations.length,
      occupancyPercentage:
        registrations.length > 0 ? Math.round((insideCount / registrations.length) * 100) : 0,
      totalMealsClaimed,
      todayScans,
    };
  }, [registrations, scanLogs]);

  // Export Gate Scans to CSV
  const exportGateLogsCSV = useCallback(() => {
    if (scanLogs.length === 0) return;
    const headers = [
      'Scan ID',
      'Registration Code',
      'Attendee Name',
      'Dars Reg No',
      'Category',
      'Checkpoint',
      'Direction',
      'Result Status',
      'Action Taken',
      'Timestamp',
      'Operator',
      'Session Context',
    ];

    const rows = scanLogs.map((l) => [
      `"${l.id}"`,
      `"${l.regCode}"`,
      `"${l.attendeeName.replace(/"/g, '""')}"`,
      `"${l.darsRegNo || ''}"`,
      `"${l.category}"`,
      `"${l.checkpoint}"`,
      `"${l.direction}"`,
      `"${l.resultStatus}"`,
      `"${l.action}"`,
      `"${l.scannedAt}"`,
      `"${l.scannedByName || ''}"`,
      `"${l.sessionContext || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ufuq26_gate_scans_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [scanLogs]);

  return {
    scanLogs,
    stats,
    isLoadingLogs,
    processScan,
    exportGateLogsCSV,
  };
}
