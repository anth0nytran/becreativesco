export const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '';

export const getVideoUrl = (filename: string) =>
  MEDIA_BASE_URL
    ? `${MEDIA_BASE_URL}/videos/${filename}`
    : `/assets/videos/${filename}`;

export const getPhotoUrl = (filename: string) =>
  MEDIA_BASE_URL
    ? `${MEDIA_BASE_URL}/photos/${filename}`
    : `/assets/photos/${filename}`;