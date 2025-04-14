import { NextResponse } from 'next/server';
import { updateAllInternalPages } from '@/lib/db';

export async function POST() {
  try {
    await updateAllInternalPages();
    return NextResponse.json({ message: 'All internal pages updated successfully' });
  } catch (error) {
    console.error('Error updating internal pages:', error);
    return NextResponse.json(
      { error: 'Failed to update internal pages', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 