import { LocalizedString } from './index';

export type GalleryCategory =
  | 'camp_moments'     // Camp UFUQ '26 workshops, sessions & camp life
  | 'dars_heritage'    // Alathurpadi Dars architecture, halaqah & classical library
  | 'ustad_scholars'   // Ustad Dr. C K Abdurahman Faizy & guest scholars
  | 'adsa_initiatives' // ADSA student body, conferences & alumni council
  | 'suffa_fraternity' // 39+ SUFFA Dars institutions across Kerala
  | 'suhba_life'       // The sacred companionship, brotherhood & mentoring
  | 'digital_craft';   // Web app engineering, audio spectrum & gate passes

export type GalleryMediaType = 'image' | 'video' | 'audio_visual' | 'document';

export type GalleryAspectRatio = 'landscape' | 'portrait' | 'square' | 'ultrawide';

export type GalleryViewMode = 'masonry' | 'bento' | 'carousel' | 'timeline';

export type GallerySortOption = 'featured' | 'newest' | 'oldest' | 'views';

export interface ExifMetadata {
  camera?: string;
  lens?: string;
  focalLength?: string;
  iso?: string;
  aperture?: string;
  shutterSpeed?: string;
  dimensions?: string;
  fileSize?: string;
}

export interface GalleryItem {
  id: string;
  title: LocalizedString;
  caption?: LocalizedString;
  description?: LocalizedString;
  mediaType: GalleryMediaType;
  url: string;                          // Supabase public CDN URL or asset path
  thumbnailUrl?: string;                // Optimized thumbnail URL
  blurDataUrl?: string;                 // Base64 shimmer blur placeholder
  aspectRatio: GalleryAspectRatio;
  width?: number;
  height?: number;
  category: GalleryCategory;
  tags: string[];
  date?: string;                        // ISO string (e.g. '2026-12-24')
  hijriDate?: string;                   // e.g. '14 Rajab 1448 AH'
  location?: LocalizedString;           // e.g. 'Alathurpadi Dars Main Hall'
  photographer?: string;
  featured: boolean;                    // Displayed in homepage Bento section
  heroSpotlight?: boolean;              // Highlighted in 3D Horizon marquee
  order: number;
  published: boolean;
  storyGroup?: string;                  // Key for Story Reel playback (e.g. 'heritage_tour')
  exif?: ExifMetadata;
  views?: number;
  likes?: number;
  downloadAllowed?: boolean;
  comparisonUrl?: string;               // Optional secondary URL for Before/After slider
  createdAt: string;
  updatedAt: string;
}

export interface GalleryStoryReel {
  id: string;
  category: GalleryCategory;
  title: LocalizedString;
  coverUrl: string;
  items: GalleryItem[];
}
