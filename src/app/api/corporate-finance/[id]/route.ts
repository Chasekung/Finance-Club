import { NextResponse } from 'next/server';
import { updateCorporateFinanceContent, deleteCorporateFinanceContent, getCorporateFinanceContentById } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const content = await getCorporateFinanceContentById(params.id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Parse teams and leaderboard content before sending
    if (content.teamsContent) {
      try {
        content.teamsContent = JSON.parse(content.teamsContent);
      } catch (e) {
        console.error('Error parsing teams content:', e);
        content.teamsContent = [];
      }
    }

    if (content.leaderboardContent) {
      try {
        content.leaderboardContent = JSON.parse(content.leaderboardContent);
      } catch (e) {
        console.error('Error parsing leaderboard content:', e);
        content.leaderboardContent = [];
      }
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedContent = await updateCorporateFinanceContent(params.id, body);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCorporateFinanceContent(params.id);
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 