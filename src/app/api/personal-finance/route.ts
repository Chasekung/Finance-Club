import { NextResponse } from 'next/server';
import { getAllPersonalFinanceContent } from '@/lib/db';

const FIXED_SECTIONS = ['News', 'Challenges', 'Competitions'];

// Helper function to convert string to title case
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export async function GET() {
  try {
    const content = await getAllPersonalFinanceContent();
    
    if (!Array.isArray(content)) {
      throw new Error('Invalid content format: expected an array');
    }

    // Initialize all sections including fixed ones
    const groupedContent: Record<string, any[]> = {};
    FIXED_SECTIONS.forEach(section => {
      groupedContent[section] = [];
    });

    // Group content by section
    content.forEach(item => {
      const section = toTitleCase(item.section || 'Other');
      if (!groupedContent[section]) {
        groupedContent[section] = [];
      }
      groupedContent[section].push(item);
    });

    // Sort sections alphabetically (except fixed sections)
    const sortedContent: Record<string, any[]> = {};
    
    // Add fixed sections first
    FIXED_SECTIONS.forEach(section => {
      sortedContent[section] = groupedContent[section];
    });

    // Add remaining sections in alphabetical order
    Object.keys(groupedContent)
      .filter(section => !FIXED_SECTIONS.includes(section))
      .sort()
      .forEach(section => {
        if (groupedContent[section].length > 0) {
          sortedContent[section] = groupedContent[section];
        }
      });

    return NextResponse.json({
      fixedSections: FIXED_SECTIONS,
      content: sortedContent
    });
  } catch (error) {
    console.error('Error fetching personal finance content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch content', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 