/**
 * Media URL helpers
 * 
 * These helpers build public URLs for media assets. They now support
 * Cloudflare R2 via NEXT_PUBLIC_R2_ASSET_BASE_URL.
 * 
 * If R2 is configured, URLs will be:
 *   https://<your-r2-public-url>/videos/filename.mp4
 *   https://<your-r2-public-url>/photos/filename.jpg
 * 
 * If R2 is NOT configured, falls back to local /assets/ paths:
 *   /assets/videos/filename.mp4
 *   /assets/photos/filename.jpg
 */

export const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_ASSET_BASE_URL || '';

/**
 * Get public URL for a video file
 */
export const getVideoUrl = (filename: string): string => {
  if (R2_BASE_URL) {
    return `${R2_BASE_URL}/videos/${filename}`;
  }
  return `/assets/videos/${filename}`;
};

/**
 * Get public URL for a photo file
 */
export const getPhotoUrl = (filename: string): string => {
  if (R2_BASE_URL) {
    return `${R2_BASE_URL}/photos/${filename}`;
  }
  return `/assets/photos/${filename}`;
};

/**
 * Get public URL for any R2 object by key
 */
export const getR2Url = (key: string): string => {
  if (R2_BASE_URL) {
    const cleanKey = key.startsWith('/') ? key.slice(1) : key;
    return `${R2_BASE_URL}/${cleanKey}`;
  }
  return `/${key}`;
};
