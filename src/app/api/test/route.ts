import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection by creating a test user
    await dbOperations.createUser('testuser', 'testpass', 'test@example.com', 'Test User');
    
    // Try to find the user
    const user = dbOperations.findUserByUsername('testuser');
    
    if (user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database connection successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 