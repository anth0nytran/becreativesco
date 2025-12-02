import { NextResponse } from 'next/server';
import { listObjectsByPrefix, toMediaItems, sortMediaItems, MediaItem } from '@/lib/r2Client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/media/hero
 * Returns the hero video (first item from hero/ folder)
 */
export async function GET() {
  try {
    const objects = await listObjectsByPrefix('hero/');
    let items = toMediaItems(objects);
    items = sortMediaItems(items);

    // Hero expects a single video; return the first one
    const heroItem: MediaItem | null = items.find((item) => item.type === 'video') || items[0] || null;

    return NextResponse.json({
      item: heroItem,
      items, // Also return all items in case there's a poster image
    });
  } catch (error) {
    console.error('Error fetching hero media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero media', item: null, items: [] },
      { status: 500 }
    );
  }
}

