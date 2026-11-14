import { ScheduleSession, Guest, SuffaDars } from './index';

export type ShareContentType = 'event' | 'session' | 'guest' | 'dars' | 'pass' | 'custom';

export interface AttendeePassData {
  fullName: string;
  refId: string;
  darsName?: string;
  darsRegNo?: string;
  darsMudarris?: string;
  phone?: string;
  submittedAt?: string;
}

export interface SharePayload {
  title: string;
  text?: string;
  url: string;
  type?: ShareContentType;
  badgeText?: string;
  session?: ScheduleSession;
  guest?: Guest;
  dars?: SuffaDars;
  attendee?: AttendeePassData;
}

export type StoryTheme = 'horizon' | 'pass' | 'session' | 'guest';
export type StoryFormat = 'story' | 'feed'; // story = 1080x1920 (9:16), feed = 1200x630 (1.91:1)

export interface SocialChannel {
  id: string;
  name: string;
  icon: string;
  color: string;
  getUrl: (payload: SharePayload) => string;
}
