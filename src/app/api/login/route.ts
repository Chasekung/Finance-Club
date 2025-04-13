import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { findUserByUsername } from '@/lib/db';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('Finding user:', username);
    const user = await findUserByUsername(username);
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password');
    const isValid = await compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    console.log('Creating session for user:', user.id);
    await createSession(user.id);

    return NextResponse.json(
      { 
        message: 'Login successful', 
        user: { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          isAdmin: user.isAdmin 
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 