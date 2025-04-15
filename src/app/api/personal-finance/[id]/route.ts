import { NextResponse } from 'next/server';
import { deletePersonalFinanceContent, updatePersonalFinanceContent } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedContent = await updatePersonalFinanceContent(params.id, body);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating personal finance content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deletePersonalFinanceContent(id);
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting personal finance content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete content',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 