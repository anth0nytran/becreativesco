import { NextResponse } from 'next/server';
import { listObjectsByPrefix, toMediaItems, sortMediaItems } from '@/lib/r2Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/media/portfolio
 * Returns videos for the home screen portfolio grid (up to 9 items)
 */
export async function GET() {
  try {
    const objects = await listObjectsByPrefix('videos/portfolio/');
    let items = toMediaItems(objects);
    items = sortMediaItems(items);

    // Filter to videos only, limit to 9
    const videos = items.filter((item) => item.type === 'video').slice(0, 9);

    return NextResponse.json({ items: videos });
  } catch (error) {
    console.error('Error fetching portfolio media:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio media', items: [] }, { status: 500 });
  }
}

