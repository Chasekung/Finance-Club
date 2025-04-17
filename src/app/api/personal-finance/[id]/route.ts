import { NextResponse } from 'next/server';
import { deletePersonalFinanceContent, updatePersonalFinanceContent, getPersonalFinanceContentById } from '@/lib/db';
import { PersonalFinanceContent } from '@/types';

export async function generateStaticParams() {
  // Fetch all personal finance content IDs
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/personal-finance`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  
  // Extract all IDs from the content
  const ids = Object.values(data.content)
    .flat()
    .map((item: any) => item.id);
  
  return ids.map((id) => ({
    id: id.toString(),
  }));
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const content = await getPersonalFinanceContentById(params.id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Parse teams and leaderboard content before sending
    if (content.teamsContent) {
      try {
        content.teamsContent = JSON.parse(content.teamsContent as string);
      } catch (e) {
        console.error('Error parsing teams content:', e);
        content.teamsContent = '[]';
      }
    }

    if (content.leaderboardContent) {
      try {
        content.leaderboardContent = JSON.parse(content.leaderboardContent as string);
      } catch (e) {
        console.error('Error parsing leaderboard content:', e);
        content.leaderboardContent = '[]';
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
    const updatedContent = await updatePersonalFinanceContent(params.id, body);
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
    await deletePersonalFinanceContent(params.id);
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 