import { NextResponse } from 'next/server';
import { listObjectsByPrefix, toMediaItems, sortMediaItems } from '@/lib/r2Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/media/grid
 * Returns videos for the two-column video grid (1-4 items)
 */
export async function GET() {
  try {
    const objects = await listObjectsByPrefix('videos/grid/');
    let items = toMediaItems(objects);
    items = sortMediaItems(items);

    // Filter to videos only, limit to 4
    const videos = items.filter((item) => item.type === 'video').slice(0, 4);

    return NextResponse.json({ items: videos });
  } catch (error) {
    console.error('Error fetching grid media:', error);
    return NextResponse.json({ error: 'Failed to fetch grid media', items: [] }, { status: 500 });
  }
}

