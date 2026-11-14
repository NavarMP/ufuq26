'use client';

import React, { useState, useEffect } from 'react';
import { useEvent } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

// Admin Architecture Components
import AdminShell from '@/components/admin/layout/AdminShell';
import { AdminTab } from '@/components/admin/layout/AdminSidebar';
import AdminLoginGate from '@/components/admin/auth/AdminLoginGate';

// Domain Tab Managers
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import RegistrationsManager from '@/components/admin/registrations/RegistrationsManager';
import NotificationManager from '@/components/admin/notifications/NotificationManager';
import DarsManager from '@/components/admin/dars/DarsManager';
import GateCommander from '@/components/admin/gate/GateCommander';
import SessionsManager from '@/components/admin/sessions/SessionsManager';
import GuestsManager from '@/components/admin/guests/GuestsManager';
import FaqsManager from '@/components/admin/faqs/FaqsManager';
import GalleryManager from '@/components/admin/gallery/GalleryManager';
import AudioManager from '@/components/admin/audio/AudioManager';
import SettingsManager from '@/components/admin/settings/SettingsManager';

export default function AdminPage() {
  const {
    eventInfo,
    schedule,
    guests,
    faqs,
    registrations,
    audioTracks,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    bulkUpdateGalleryItems,
    bulkDeleteGalleryItems,
    reorderGalleryItems,
    darsList,
    addDars,
    updateDars,
    deleteDars,
    resetDarsToDefault,
    darsAccounts,
    addDarsAccount,
    updateDarsAccount,
    deleteDarsAccount,
    seedDarsAccounts,
    exportDarsCredentialsCSV,
    updateEventInfo,
    addSession,
    updateSession,
    deleteSession,
    addGuest,
    updateGuest,
    deleteGuest,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    addAudioTrack,
    updateAudioTrack,
    deleteAudioTrack,
    reorderAudioTracks,
    fetchRegistrations,
    exportRegistrationsCSV,
    resetToDefaultData,
  } = useEvent();

  const { user, loading: authLoading, signIn, signOut, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Auto-fetch registrations when organizer is authenticated
  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user, fetchRegistrations]);

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-pattern">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
          <p className="text-xs font-mono text-neutral-400">
            Verifying organizer session...
          </p>
        </div>
      </div>
    );
  }

  // Login Gate
  if (!user) {
    return (
      <AdminLoginGate
        onSignIn={signIn}
        onResetPassword={resetPassword}
      />
    );
  }

  return (
    <AdminShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={user}
      onSignOut={() => signOut()}
      counts={{
        registrations: registrations.length,
        darsAccounts: darsAccounts.length,
        schedule: schedule.length,
        guests: guests.length,
        faqs: faqs.length,
        audioTracks: audioTracks.length,
        galleryItems: galleryItems.length,
      }}
      sessions={schedule}
      guests={guests}
      faqs={faqs}
      darsList={darsList}
      registrations={registrations}
      onOpenSessionModal={() => {
        setActiveTab('sessions');
      }}
      onOpenGuestModal={() => {
        setActiveTab('guests');
      }}
      onExportCsv={exportRegistrationsCSV}
    >
      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <DashboardOverview
          user={user}
          onSelectTab={setActiveTab}
          onOpenSessionModal={() => {
            setActiveTab('sessions');
          }}
          onOpenGuestModal={() => {
            setActiveTab('guests');
          }}
          onExportRegistrationsCsv={exportRegistrationsCSV}
          onToggleRegistration={async () => {
            await updateEventInfo({ registrationOpen: !eventInfo.registrationOpen });
          }}
          registrations={registrations}
          schedule={schedule}
          guests={guests}
          faqs={faqs}
          darsAccounts={darsAccounts}
          audioTracks={audioTracks}
          eventInfo={eventInfo}
        />
      )}

      {/* TAB 2: DELEGATE REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <RegistrationsManager
          registrations={registrations}
          darsList={darsList}
          onRefresh={fetchRegistrations}
        />
      )}

      {/* TAB: COMMS & BROADCASTS HUB */}
      {activeTab === 'notifications' && (
        <NotificationManager
          registrations={registrations}
          darsList={darsList}
        />
      )}

      {/* TAB 3: SUFFA DARS & LOGINS */}
      {activeTab === 'dars' && (
        <DarsManager
          darsList={darsList}
          darsAccounts={darsAccounts}
          registrations={registrations}
          addDarsAccount={addDarsAccount}
          updateDarsAccount={updateDarsAccount}
          deleteDarsAccount={deleteDarsAccount}
          seedDarsAccounts={seedDarsAccounts}
          exportDarsCredentialsCSV={exportDarsCredentialsCSV}
          addDars={addDars}
          updateDars={updateDars}
          deleteDars={deleteDars}
          resetDarsToDefault={resetDarsToDefault}
        />
      )}

      {/* TAB 4: GATE & SCANNING OPERATIONS */}
      {activeTab === 'gate' && (
        <GateCommander
          registrations={registrations}
          darsList={darsList}
        />
      )}

      {/* TAB 4: SCHEDULE MATRIX */}
      {activeTab === 'sessions' && (
        <SessionsManager
          schedule={schedule}
          addSession={addSession}
          updateSession={updateSession}
          deleteSession={deleteSession}
        />
      )}

      {/* TAB 5: FACULTY & GUEST SPEAKERS */}
      {activeTab === 'guests' && (
        <GuestsManager
          guests={guests}
          addGuest={addGuest}
          updateGuest={updateGuest}
          deleteGuest={deleteGuest}
        />
      )}

      {/* TAB 6: KNOWLEDGE BASE & FAQS */}
      {activeTab === 'faqs' && (
        <FaqsManager
          faqs={faqs}
          addFAQ={addFAQ}
          updateFAQ={updateFAQ}
          deleteFAQ={deleteFAQ}
        />
      )}

      {/* TAB 7: GALLERY SHOWCASE CRUD */}
      {activeTab === 'gallery' && (
        <GalleryManager
          galleryItems={galleryItems}
          addGalleryItem={addGalleryItem}
          updateGalleryItem={updateGalleryItem}
          deleteGalleryItem={deleteGalleryItem}
          bulkUpdateGalleryItems={bulkUpdateGalleryItems}
          bulkDeleteGalleryItems={bulkDeleteGalleryItems}
          reorderGalleryItems={reorderGalleryItems}
        />
      )}

      {/* TAB 8: BACKGROUND AUDIO STUDIO */}
      {activeTab === 'audio' && (
        <AudioManager
          audioTracks={audioTracks}
          addAudioTrack={addAudioTrack}
          updateAudioTrack={updateAudioTrack}
          deleteAudioTrack={deleteAudioTrack}
          reorderAudioTracks={reorderAudioTracks}
        />
      )}

      {/* TAB 8: EVENT SETTINGS */}
      {activeTab === 'settings' && (
        <SettingsManager
          eventInfo={eventInfo}
          updateEventInfo={updateEventInfo}
          resetToDefaultData={resetToDefaultData}
        />
      )}
    </AdminShell>
  );
}
