import { NextResponse } from 'next/server';
import { getAllCorporateFinanceContent } from '@/lib/db';

const FIXED_SECTIONS = ['News', 'Challenges', 'Competitions'];

// Helper function to convert string to title case
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export async function GET() {
  try {
    const content = await getAllCorporateFinanceContent();
    
    // Initialize fixed sections
    const groupedContent = FIXED_SECTIONS.reduce((acc, section) => {
      acc[section] = [];
      return acc;
    }, {} as Record<string, any[]>);

    // Group content by section
    content.forEach(item => {
      const section = toTitleCase(item.newSectionName || item.section);
      if (!groupedContent[section]) {
        groupedContent[section] = [];
      }
      groupedContent[section].push(item);
    });

    // Remove empty fixed sections
    Object.keys(groupedContent).forEach(section => {
      if (FIXED_SECTIONS.includes(section) && groupedContent[section].length === 0) {
        delete groupedContent[section];
      }
    });

    return NextResponse.json({
      fixedSections: FIXED_SECTIONS,
      content: groupedContent
    });
  } catch (error) {
    console.error('Error fetching corporate finance content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 