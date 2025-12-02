import { NextResponse } from 'next/server';
import { listObjectsByPrefix, toMediaItems, sortMediaItems, R2Object } from '@/lib/r2Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/media/gallery
 * Returns images for the rotating photo gallery
 */
export async function GET() {
  try {
    const prefixes = ['gallery/', 'photos/', 'photos/photos/'];
    const seen = new Map<string, R2Object>();

    for (const prefix of prefixes) {
      const objects = await listObjectsByPrefix(prefix);
      objects.forEach((obj) => {
        if (obj.key && !seen.has(obj.key)) {
          seen.set(obj.key, obj);
        }
      });
    }

    let items = toMediaItems(Array.from(seen.values()));
    items = sortMediaItems(items);

    // Filter to images only for gallery
    const images = items.filter((item) => item.type === 'image');

    return NextResponse.json({ items: images });
  } catch (error) {
    console.error('Error fetching gallery media:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery media', items: [] }, { status: 500 });
  }
}

