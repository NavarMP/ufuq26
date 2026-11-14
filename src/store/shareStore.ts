import { create } from 'zustand';
import { SharePayload } from '@/types/share';

interface ShareStoreState {
  isOpen: boolean;
  payload: SharePayload;
  activeTab: 'channels' | 'qr' | 'story' | 'embed';
  openShare: (payload: Partial<SharePayload> & { url?: string }, defaultTab?: 'channels' | 'qr' | 'story' | 'embed') => void;
  closeShare: () => void;
  setActiveTab: (tab: 'channels' | 'qr' | 'story' | 'embed') => void;
}

const defaultPayload: SharePayload = {
  title: 'UFUQ ’26 — A Transition & Leadership Camp',
  text: 'Rooted in Ilm. Ready for the World. December 24–30, 2026 at Alathurpadi Dars Campus, Malappuram, Kerala.',
  url: 'https://alathurpadidars.in',
  type: 'event',
};

export const useShareStore = create<ShareStoreState>((set) => ({
  isOpen: false,
  payload: defaultPayload,
  activeTab: 'channels',
  openShare: (incoming, defaultTab = 'channels') => {
    const fullUrl = incoming.url
      ? (incoming.url.startsWith('http') ? incoming.url : `https://alathurpadidars.in${incoming.url}`)
      : (typeof window !== 'undefined' ? window.location.href : 'https://alathurpadidars.in');

    set({
      isOpen: true,
      activeTab: defaultTab,
      payload: {
        title: incoming.title || defaultPayload.title,
        text: incoming.text || defaultPayload.text,
        url: fullUrl,
        type: incoming.type || 'event',
        badgeText: incoming.badgeText,
        session: incoming.session,
        guest: incoming.guest,
        dars: incoming.dars,
        attendee: incoming.attendee,
      },
    });
  },
  closeShare: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
