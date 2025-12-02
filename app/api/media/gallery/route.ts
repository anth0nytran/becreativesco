import { NextResponse } from 'next/server';
import { listObjectsByPrefix, toMediaItems, sortMediaItems } from '@/lib/r2Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/media/gallery
 * Returns images for the rotating photo gallery
 */
export async function GET() {
  try {
    const objects = await listObjectsByPrefix('videos/gallery/');
    let items = toMediaItems(objects);
    items = sortMediaItems(items);

    // Filter to images only for gallery
    const images = items.filter((item) => item.type === 'image');

    return NextResponse.json({ items: images });
  } catch (error) {
    console.error('Error fetching gallery media:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery media', items: [] }, { status: 500 });
  }
}

