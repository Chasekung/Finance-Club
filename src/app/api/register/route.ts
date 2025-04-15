import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { findUserByUsername, createUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password, fullName } = await request.json();
    
    // Validate input
    if (!username || !password || !fullName) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Username, password, and full name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user:', username);
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await hash(password, 12);

    // Create user
    console.log('Creating new user');
    const userId = await createUser({
      username,
      password: hashedPassword,
      fullName
    });

    console.log('User created successfully with ID:', userId);
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 