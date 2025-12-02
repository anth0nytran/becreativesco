/**
 * Cloudflare R2 Client Helper
 * ===========================
 * 
 * Required environment variables (server-side):
 * - R2_ACCOUNT_ID         – Cloudflare account ID
 * - R2_ACCESS_KEY_ID      – R2 access key ID
 * - R2_SECRET_ACCESS_KEY  – R2 secret access key
 * - R2_BUCKET_NAME        – Bucket name (e.g. "assets")
 * - R2_ENDPOINT           – https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com
 * 
 * Required environment variables (client-side):
 * - NEXT_PUBLIC_R2_ASSET_BASE_URL – Public base URL for serving assets
 *     e.g. "https://my-assets.example.com" or "https://pub-xxxxxx.r2.dev"
 * 
 * Bucket folder structure:
 * - gallery/   – rotating photo gallery images
 * - grid/      – two-column video grid (1-4 items)
 * - hero/      – hero section video
 * - portfolio/ – home screen videos (1-9)
 * - projects/  – dedicated portfolio page videos (1-12)
 * 
 * To add a new media folder:
 * 1. Upload files to R2 under `assets/<new-folder>/`
 * 2. Create `/app/api/media/<new-folder>/route.ts` (copy an existing route)
 * 3. Call `listObjectsByPrefix('<new-folder>/')` in the route handler
 * 4. Consume the endpoint from your component
 */

import { S3Client, ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MediaItem {
  key: string;
  url: string;
  type: 'image' | 'video';
  size?: number;
  order?: number;
}

export interface R2Object {
  key: string;
  size?: number;
  contentType?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// R2 Client (singleton, server-side only)
// ─────────────────────────────────────────────────────────────────────────────

let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (r2Client) return r2Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing R2 environment variables. Ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are set.'
    );
  }

  const endpoint = process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`;

  r2Client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return r2Client;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public URL builder (safe for client-side via NEXT_PUBLIC_ prefix)
// ─────────────────────────────────────────────────────────────────────────────

export function getPublicUrl(key: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_ASSET_BASE_URL || '';
  if (!baseUrl) {
    // Fallback to local assets during development if no R2 URL is configured
    return `/${key}`;
  }
  // Strip leading slash from key if present
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${baseUrl}/${cleanKey}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// List objects by prefix (server-side only)
// ─────────────────────────────────────────────────────────────────────────────

export async function listObjectsByPrefix(prefix: string): Promise<R2Object[]> {
  const client = getR2Client();
  const bucketName = process.env.R2_BUCKET_NAME || 'assets';

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const response = await client.send(command);

  if (!response.Contents) {
    return [];
  }

  return response.Contents
    .filter((obj): obj is _Object & { Key: string } => Boolean(obj.Key))
    .map((obj) => ({
      key: obj.Key,
      size: obj.Size,
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];

export function getMediaType(key: string): 'image' | 'video' {
  const lowerKey = key.toLowerCase();
  if (IMAGE_EXTENSIONS.some((ext) => lowerKey.endsWith(ext))) {
    return 'image';
  }
  if (VIDEO_EXTENSIONS.some((ext) => lowerKey.endsWith(ext))) {
    return 'video';
  }
  // Default to video for unknown types
  return 'video';
}

/**
 * Converts R2 objects to MediaItem array with public URLs
 */
export function toMediaItems(objects: R2Object[]): MediaItem[] {
  return objects
    .filter((obj) => {
      // Exclude folder markers (keys ending with /)
      return !obj.key.endsWith('/');
    })
    .map((obj, index) => ({
      key: obj.key,
      url: getPublicUrl(obj.key),
      type: getMediaType(obj.key),
      size: obj.size,
      order: index,
    }));
}

/**
 * Extracts a numeric order from filename if present (e.g. "01-video.mp4" → 1)
 * Falls back to alphabetical sorting
 */
export function sortMediaItems(items: MediaItem[]): MediaItem[] {
  return [...items].sort((a, b) => {
    const aName = a.key.split('/').pop() || '';
    const bName = b.key.split('/').pop() || '';

    // Try to extract leading numbers
    const aMatch = aName.match(/^(\d+)/);
    const bMatch = bName.match(/^(\d+)/);

    if (aMatch && bMatch) {
      return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
    }

    // Fallback to alphabetical
    return aName.localeCompare(bName);
  });
}

