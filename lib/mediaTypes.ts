/**
 * Shared media types for client components
 */

export interface MediaItem {
  key: string;
  url: string;
  type: 'image' | 'video';
  size?: number;
  order?: number;
}

export interface HeroMediaResponse {
  item: MediaItem | null;
  items: MediaItem[];
  error?: string;
}

export interface MediaListResponse {
  items: MediaItem[];
  error?: string;
}

