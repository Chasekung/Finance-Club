import { NextResponse } from 'next/server';
import { createCorporateFinanceContent } from '@/lib/db';

interface CreateContentRequest {
  section: string;
  newSectionName?: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
  includeInstructions: boolean;
  includeTeams: boolean;
  includeMainActivity: boolean;
  includeLeaderboard: boolean;
  includeTitle: boolean;
  instructionsContent?: string;
  teamsContent?: string;
  mainActivityContent?: string;
  leaderboardContent?: string;
  titleContent?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateContentRequest;
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.section || !body.itemName || !body.linkType) {
      console.error('Missing required fields:', { section: body.section, itemName: body.itemName, linkType: body.linkType });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate URL based on link type
    if (body.linkType === 'external' && !body.externalUrl) {
      console.error('Missing external URL for external link type');
      return NextResponse.json(
        { error: 'External URL is required for external links' },
        { status: 400 }
      );
    }

    if (body.linkType === 'internal' && !body.internalUrl) {
      console.error('Missing internal URL for internal link type');
      return NextResponse.json(
        { error: 'Internal URL is required for internal links' },
        { status: 400 }
      );
    }

    // Create the content in the database
    const content = await createCorporateFinanceContent({
      section: body.section,
      newSectionName: body.newSectionName,
      itemName: body.itemName,
      linkType: body.linkType,
      externalUrl: body.externalUrl,
      internalUrl: body.internalUrl,
      includeInstructions: body.includeInstructions,
      includeTeams: body.includeTeams,
      includeMainActivity: body.includeMainActivity,
      includeLeaderboard: body.includeLeaderboard,
      includeTitle: body.includeTitle,
      instructionsContent: body.instructionsContent,
      teamsContent: body.teamsContent,
      mainActivityContent: body.mainActivityContent,
      leaderboardContent: body.leaderboardContent,
      titleContent: body.titleContent
    });

    console.log('Successfully created content:', content);
    return NextResponse.json(
      { message: 'Content created successfully', content },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 