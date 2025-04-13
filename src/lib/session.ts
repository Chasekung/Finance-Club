import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function createSession(userId: string) {
  try {
    // Create JWT token
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Set HTTP-only cookie
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return token;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const token = cookies().get('session')?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}

export async function deleteSession() {
  try {
    cookies().delete('session');
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
} 