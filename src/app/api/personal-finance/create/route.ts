import { NextResponse } from 'next/server';
import { createPersonalFinanceContent } from '@/lib/db';

interface CreateContentRequest {
  section: string;
  newSectionName?: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
  includeTitle: boolean;
  includeInstructions: boolean;
  includeTeams: boolean;
  includeMainActivity: boolean;
  includeLeaderboard: boolean;
  titleContent: string;
  instructionsContent: string;
  teamsContent: string;
  mainActivityContent: string;
  leaderboardContent: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateContentRequest = await request.json();

    // Validate required fields
    if (!body.section) {
      return NextResponse.json({ error: 'Section is required' }, { status: 400 });
    }
    if (!body.itemName) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }
    if (!body.linkType) {
      return NextResponse.json({ error: 'Link type is required' }, { status: 400 });
    }

    // Validate URLs based on link type
    if (body.linkType === 'external' && !body.externalUrl) {
      return NextResponse.json({ error: 'External URL is required for external links' }, { status: 400 });
    }
    if (body.linkType === 'internal' && !body.internalUrl) {
      return NextResponse.json({ error: 'Internal URL is required for internal links' }, { status: 400 });
    }

    // Create content in database
    const content = await createPersonalFinanceContent(body);

    return NextResponse.json({ message: 'Content created successfully', content });
  } catch (error) {
    console.error('Error creating personal finance content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create content' },
      { status: 500 }
    );
  }
} 