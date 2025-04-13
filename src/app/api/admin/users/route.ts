import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAllUsers } from '@/lib/db';

export async function GET() {
  try {
    // Verify admin session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all users
    const users = await getAllUsers();
    
    // Return user data (excluding passwords)
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      createdAt: user.createdAt
    }));

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 