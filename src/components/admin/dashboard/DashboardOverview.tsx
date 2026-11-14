'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEvent } from '@/context/EventContext';
import { AdminTab } from '../layout/AdminSidebar';
import {
  Registration,
  ScheduleSession,
  Guest,
  FAQ,
  DarsAccount,
  AudioTrack,
  EventInfo,
} from '@/types';
import { User } from 'firebase/auth';

// 8 Subsystems
import DashboardHeroDeck from './DashboardHeroDeck';
import DashboardKpiMatrix from './DashboardKpiMatrix';
import DashboardCapacityGauge from './DashboardCapacityGauge';
import DashboardAnalyticsSuite from './DashboardAnalyticsSuite';
import DashboardInstitutionalRank from './DashboardInstitutionalRank';
import DashboardPagesMatrix from './DashboardPagesMatrix';
import DashboardStorageTracker from './DashboardStorageTracker';
import DashboardLiveActivityFeed from './DashboardLiveActivityFeed';
import DashboardQuickShortcuts from './DashboardQuickShortcuts';
import ExecutiveReportModal from './ExecutiveReportModal';

interface DashboardOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
  onOpenSessionModal: () => void;
  onOpenGuestModal: () => void;
  onExportRegistrationsCsv: () => void;
  registrations: Registration[];
  schedule: ScheduleSession[];
  guests: Guest[];
  faqs: FAQ[];
  darsAccounts: DarsAccount[];
  audioTracks: AudioTrack[];
  eventInfo: EventInfo;
  user?: User | null;
  onToggleRegistration?: () => Promise<void>;
}

export default function DashboardOverview({
  onSelectTab,
  onOpenSessionModal,
  onOpenGuestModal,
  onExportRegistrationsCsv,
  registrations,
  schedule,
  guests,
  faqs,
  darsAccounts,
  audioTracks,
  eventInfo,
  user: propUser,
  onToggleRegistration: propToggleReg,
}: DashboardOverviewProps) {
  // Use auth and event context fallbacks
  const { user: authUser } = useAuth();
  const { updateEventInfo } = useEvent();
  const currentUser = propUser || authUser;

  // Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTogglingRegistration, setIsTogglingRegistration] = useState(false);

  // Toggle registration gate handler
  const handleToggleRegistration = async () => {
    if (propToggleReg) {
      await propToggleReg();
      return;
    }

    try {
      setIsTogglingRegistration(true);
      await updateEventInfo({
        registrationOpen: !eventInfo.registrationOpen,
      });
    } catch (err) {
      console.error('Failed to toggle registration gate:', err);
    } finally {
      setIsTogglingRegistration(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-900 dark:text-white">
      {/* 1. Hero Command Deck */}
      <DashboardHeroDeck
        user={currentUser}
        eventInfo={eventInfo}
        audioTracks={audioTracks}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onExportCsv={onExportRegistrationsCsv}
        onSelectTab={onSelectTab}
        onToggleRegistration={handleToggleRegistration}
        isTogglingRegistration={isTogglingRegistration}
      />

      {/* 2. Primary KPI Velocity Matrix */}
      <DashboardKpiMatrix
        registrations={registrations}
        schedule={schedule}
        guests={guests}
        faqs={faqs}
        darsAccounts={darsAccounts}
        audioTracks={audioTracks}
        onSelectTab={onSelectTab}
      />

      {/* 3. Capacity Gauge & Institutional Rank Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <DashboardCapacityGauge
            registrations={registrations}
            eventInfo={eventInfo}
            onViewRegistrations={() => onSelectTab('registrations')}
          />
        </div>
        <div className="lg:col-span-2">
          <DashboardInstitutionalRank
            registrations={registrations}
            darsAccounts={darsAccounts}
            onSelectTab={onSelectTab}
          />
        </div>
      </div>

      {/* 4. Interactive Analytics Suite (Velocity Graph & Track Distribution) */}
      <DashboardAnalyticsSuite
        registrations={registrations}
        schedule={schedule}
        onSelectStatus={() => onSelectTab('registrations')}
      />

      {/* 5. Pages & Portal Health Matrix */}
      <DashboardPagesMatrix
        eventInfo={eventInfo}
        darsAccounts={darsAccounts}
        audioTracks={audioTracks}
        onSelectTab={onSelectTab}
      />

      {/* 6. Cloud Storage & Data Footprint */}
      <DashboardStorageTracker
        registrations={registrations}
        schedule={schedule}
        guests={guests}
        faqs={faqs}
        darsAccounts={darsAccounts}
        audioTracks={audioTracks}
      />

      {/* 7. Live Activity Feed & Operational Speed-Dial Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <DashboardLiveActivityFeed
          registrations={registrations}
          darsAccounts={darsAccounts}
          audioTracks={audioTracks}
          onSelectTab={onSelectTab}
        />
        <DashboardQuickShortcuts
          onSelectTab={onSelectTab}
          onOpenSessionModal={onOpenSessionModal}
          onOpenGuestModal={onOpenGuestModal}
          onExportRegistrationsCsv={onExportRegistrationsCsv}
        />
      </div>

      {/* 8. Printable Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        registrations={registrations}
        schedule={schedule}
        guests={guests}
        darsAccounts={darsAccounts}
        eventInfo={eventInfo}
      />
    </div>
  );
}
