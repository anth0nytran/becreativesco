import { NextResponse } from 'next/server';
import { listObjectsByPrefix, toMediaItems, sortMediaItems } from '@/lib/r2Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/media/projects
 * Returns videos for the dedicated portfolio/projects page (up to 12 items)
 */
export async function GET() {
  try {
    const objects = await listObjectsByPrefix('videos/projects/');
    let items = toMediaItems(objects);
    items = sortMediaItems(items);

    // Filter to videos only, limit to 12
    const videos = items.filter((item) => item.type === 'video').slice(0, 12);

    return NextResponse.json({ items: videos });
  } catch (error) {
    console.error('Error fetching projects media:', error);
    return NextResponse.json({ error: 'Failed to fetch projects media', items: [] }, { status: 500 });
  }
}

