'use client';

import { useState, useEffect } from 'react';
import type { MediaItem, HeroMediaResponse, MediaListResponse } from '@/lib/mediaTypes';

type MediaEndpoint = 'hero' | 'gallery' | 'grid' | 'portfolio' | 'projects';

interface UseMediaOptions {
  /** Whether to fetch immediately on mount (default: true) */
  immediate?: boolean;
}

interface UseMediaResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch media from the API endpoints
 */
export function useMedia<T = MediaListResponse>(
  endpoint: MediaEndpoint,
  options: UseMediaOptions = {}
): UseMediaResult<T> {
  const { immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/media/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint} media: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error(`Error fetching ${endpoint} media:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, immediate]);

  return { data, loading, error, refetch: fetchMedia };
}

/**
 * Hook specifically for hero media (returns single item + all items)
 */
export function useHeroMedia(options?: UseMediaOptions) {
  return useMedia<HeroMediaResponse>('hero', options);
}

/**
 * Hook for gallery images
 */
export function useGalleryMedia(options?: UseMediaOptions) {
  return useMedia<MediaListResponse>('gallery', options);
}

/**
 * Hook for grid videos
 */
export function useGridMedia(options?: UseMediaOptions) {
  return useMedia<MediaListResponse>('grid', options);
}

/**
 * Hook for home portfolio videos
 */
export function usePortfolioMedia(options?: UseMediaOptions) {
  return useMedia<MediaListResponse>('portfolio', options);
}

/**
 * Hook for projects page videos
 */
export function useProjectsMedia(options?: UseMediaOptions) {
  return useMedia<MediaListResponse>('projects', options);
}

// Re-export types for convenience
export type { MediaItem, HeroMediaResponse, MediaListResponse };

