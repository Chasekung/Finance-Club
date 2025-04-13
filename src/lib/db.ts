import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { compare } from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'finance-club.db');

// Initialize database
export async function initDB() {
  try {
    console.log('Initializing database at:', dbPath);
    
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
      console.log('Database file does not exist, creating new database...');
    } else {
      console.log('Database file exists, opening connection...');
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fullName TEXT NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Find user by username
export async function findUserByUsername(username: string) {
  try {
    console.log('Finding user by username:', username);
    const db = await initDB();
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    console.log('User found:', user ? 'yes' : 'no');
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

// Create new user
export async function createUser(user: { username: string; password: string; fullName: string }) {
  try {
    console.log('Creating user:', { username: user.username, fullName: user.fullName });
    const db = await initDB();
    
    const result = await db.run(
      'INSERT INTO users (username, password, fullName) VALUES (?, ?, ?)',
      user.username,
      user.password,
      user.fullName
    );

    console.log('User creation result:', result);
    return result.lastID;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Verify password
export async function verifyPassword(userId: string, password: string) {
  try {
    console.log('Verifying password for user ID:', userId);
    const db = await initDB();
    const user = await db.get('SELECT password FROM users WHERE id = ?', userId);
    
    if (!user) {
      console.log('User not found');
      return false;
    }
    
    const isValid = await compare(password, user.password);
    console.log('Password verification result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    console.log('Fetching all users');
    const db = await initDB();
    const users = await db.all('SELECT id, username, fullName, createdAt FROM users');
    console.log(`Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
} 