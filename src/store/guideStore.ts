import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GuideRole } from '@/types/guide';
import { soundFx } from '@/lib/soundFx';

interface GuideState {
  activeRole: GuideRole;
  soundEnabled: boolean;
  checkedItems: string[];
  isTourOpen: boolean;
  currentTourIndex: number;
  isShortcutsOpen: boolean;
  hasSeenTourNotice: boolean;

  // Actions
  setActiveRole: (role: GuideRole) => void;
  toggleSound: () => void;
  toggleChecklistItem: (id: string) => void;
  resetChecklist: () => void;
  openTour: (startIndex?: number) => void;
  closeTour: () => void;
  nextTourStep: (maxSteps: number) => void;
  prevTourStep: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set, get) => ({
      activeRole: 'delegate',
      soundEnabled: true, // Default active per user request
      checkedItems: ['admission-1'], // Start with one item checked as visual cue
      isTourOpen: false,
      currentTourIndex: 0,
      isShortcutsOpen: false,
      hasSeenTourNotice: false,

      setActiveRole: (role) => {
        const { soundEnabled } = get();
        soundFx.click(soundEnabled);
        soundFx.haptic(10);
        set({ activeRole: role });
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        if (next) {
          soundFx.click(true);
        }
        set({ soundEnabled: next });
      },

      toggleChecklistItem: (id) => {
        const { checkedItems, soundEnabled } = get();
        const exists = checkedItems.includes(id);
        const updated = exists ? checkedItems.filter((i) => i !== id) : [...checkedItems, id];

        if (!exists) {
          soundFx.success(soundEnabled);
          soundFx.haptic([10, 30, 20]);
        } else {
          soundFx.click(soundEnabled);
          soundFx.haptic(8);
        }

        set({ checkedItems: updated });
      },

      resetChecklist: () => {
        const { soundEnabled } = get();
        soundFx.click(soundEnabled);
        set({ checkedItems: [] });
      },

      openTour: (startIndex = 0) => {
        const { soundEnabled } = get();
        soundFx.step(soundEnabled);
        set({ isTourOpen: true, currentTourIndex: startIndex });
      },

      closeTour: () => {
        const { soundEnabled } = get();
        soundFx.click(soundEnabled);
        set({ isTourOpen: false });
      },

      nextTourStep: (maxSteps) => {
        const { currentTourIndex, soundEnabled } = get();
        if (currentTourIndex < maxSteps - 1) {
          soundFx.step(soundEnabled);
          soundFx.haptic(12);
          set({ currentTourIndex: currentTourIndex + 1 });
        } else {
          soundFx.success(soundEnabled);
          set({ isTourOpen: false, currentTourIndex: 0 });
        }
      },

      prevTourStep: () => {
        const { currentTourIndex, soundEnabled } = get();
        if (currentTourIndex > 0) {
          soundFx.click(soundEnabled);
          soundFx.haptic(8);
          set({ currentTourIndex: currentTourIndex - 1 });
        }
      },

      openShortcuts: () => {
        const { soundEnabled } = get();
        soundFx.click(soundEnabled);
        set({ isShortcutsOpen: true });
      },

      closeShortcuts: () => {
        const { soundEnabled } = get();
        soundFx.click(soundEnabled);
        set({ isShortcutsOpen: false });
      },
    }),
    {
      name: 'ufuq26-guide-storage',
      partialize: (state) => ({
        activeRole: state.activeRole,
        soundEnabled: state.soundEnabled,
        checkedItems: state.checkedItems,
        hasSeenTourNotice: state.hasSeenTourNotice,
      }),
    }
  )
);
