import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const dbPath = path.join(process.cwd(), 'finance-club.db');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
});

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

    // Create corporate_finance_content table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS corporate_finance_content (
        id TEXT PRIMARY KEY,
        section TEXT NOT NULL,
        newSectionName TEXT,
        itemName TEXT NOT NULL,
        linkType TEXT NOT NULL,
        externalUrl TEXT,
        internalUrl TEXT,
        includeTitle INTEGER NOT NULL,
        includeInstructions INTEGER NOT NULL,
        includeTeams INTEGER NOT NULL,
        includeMainActivity INTEGER NOT NULL,
        includeLeaderboard INTEGER NOT NULL,
        titleContent TEXT,
        instructionsContent TEXT,
        teamsContent TEXT,
        mainActivityContent TEXT,
        leaderboardContent TEXT,
        createdAt TEXT NOT NULL,
        templatePath TEXT
      )
    `);

    // Create personal finance content table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS personal_finance_content (
        id TEXT PRIMARY KEY,
        section TEXT NOT NULL,
        itemName TEXT NOT NULL,
        linkType TEXT NOT NULL,
        externalUrl TEXT,
        internalUrl TEXT,
        templatePath TEXT,
        includeTitle INTEGER NOT NULL,
        includeInstructions INTEGER NOT NULL,
        includeTeams INTEGER NOT NULL,
        includeMainActivity INTEGER NOT NULL,
        includeLeaderboard INTEGER NOT NULL,
        titleContent TEXT,
        instructionsContent TEXT,
        teamsContent TEXT,
        mainActivityContent TEXT,
        leaderboardContent TEXT,
        createdAt TEXT NOT NULL
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
    const db = await initDB();
    const users = await db.all('SELECT id, username, fullName, isAdmin FROM users ORDER BY isAdmin DESC, fullName ASC');
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

interface CorporateFinanceContent {
  id: string;
  section: string;
  newSectionName?: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
  includeTitle: boolean;
  includeInstructions: boolean;
  includeTeams: boolean;
  includeMainActivity: boolean;
  includeLeaderboard: boolean;
  titleContent?: string;
  instructionsContent?: string;
  teamsContent?: string;
  mainActivityContent?: string;
  leaderboardContent?: string;
  createdAt: string;
  templatePath?: string;
}

export async function createCorporateFinanceContent(content: Omit<CorporateFinanceContent, 'id' | 'createdAt' | 'templatePath'>): Promise<CorporateFinanceContent> {
  try {
    console.log('Starting content creation with data:', JSON.stringify(content, null, 2));
    
    const db = await initDB();
    console.log('Database connection established');
    
    // Generate a unique ID using timestamp and random string
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const id = `${timestamp}-${random}`;
    const createdAt = new Date().toISOString();
    
    // Generate template path for internal links
    let templatePath = null;
    if (content.linkType === 'internal') {
      templatePath = `/corporate-finance/${content.internalUrl || id}`;
    }

    console.log('Preparing to insert content with ID:', id);
    
    const stmt = await db.prepare(`
      INSERT INTO corporate_finance_content (
        id, section, newSectionName, itemName, linkType, externalUrl, internalUrl,
        includeTitle, includeInstructions, includeTeams, includeMainActivity, includeLeaderboard,
        titleContent, instructionsContent, teamsContent, mainActivityContent, leaderboardContent,
        createdAt, templatePath
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      await stmt.run(
        id,
        content.section,
        content.newSectionName,
        content.itemName,
        content.linkType,
        content.externalUrl,
        content.internalUrl,
        content.includeTitle ? 1 : 0,
        content.includeInstructions ? 1 : 0,
        content.includeTeams ? 1 : 0,
        content.includeMainActivity ? 1 : 0,
        content.includeLeaderboard ? 1 : 0,
        content.titleContent,
        content.instructionsContent,
        content.teamsContent,
        content.mainActivityContent,
        content.leaderboardContent,
        createdAt,
        templatePath
      );
      console.log('Content successfully inserted into database');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error during database insert:', error);
      throw new Error(`Failed to insert content into database: ${errorMessage}`);
    } finally {
      await stmt.finalize();
    }

    const newContent = {
      id,
      ...content,
      createdAt,
      templatePath: templatePath || undefined
    };

    // If this is an internal link, create the template page
    if (templatePath) {
      try {
        console.log('Creating template page at:', templatePath);
        await createTemplatePage(newContent);
        console.log('Template page created successfully');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error creating template page:', error);
        throw new Error(`Failed to create template page: ${errorMessage}`);
      }
    }

    return newContent;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in createCorporateFinanceContent:', error);
    throw new Error(`Failed to create content: ${errorMessage}`);
  }
}

async function createTemplatePage(content: CorporateFinanceContent) {
  try {
    const templatePath = `src/app${content.templatePath}/page.tsx`;
    const templateContent = `
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Team {
  name: string;
  members: string;
}

interface LeaderboardEntry {
  teamName: string;
  score: number;
}

interface TemplateContent {
  title: string;
  instructions: string;
  teams: Team[];
  mainActivity: string;
  leaderboard: LeaderboardEntry[];
}

export default function CorporateFinancePage() {
  const [content, setContent] = useState<TemplateContent>({
    title: "${content.itemName}",
    instructions: "${content.instructionsContent || ''}",
    teams: ${content.teamsContent || '[]'},
    mainActivity: "${content.mainActivityContent || ''}",
    leaderboard: ${content.leaderboardContent || '[]'}
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{content.title}</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        ${content.includeTitle ? `
        {/* Title Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Title</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">${content.titleContent || ''}</p>
          </div>
        </div>
        ` : ''}

        ${content.includeInstructions ? `
        {/* Instructions Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Instructions</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">{content.instructions}</p>
          </div>
        </div>
        ` : ''}

        ${content.includeTeams ? `
        {/* Teams Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Teams</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white">Team Name</th>
                  <th className="text-left py-3 px-4 text-white">Members</th>
                </tr>
              </thead>
              <tbody>
                {content.teams.map((team, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">{team.name}</td>
                    <td className="py-3 px-4 text-white">{team.members}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        ${content.includeMainActivity ? `
        {/* Main Activity Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Main Activity</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">{content.mainActivity}</p>
          </div>
        </div>
        ` : ''}

        ${content.includeLeaderboard ? `
        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white">Team Name</th>
                  <th className="text-right py-3 px-4 text-white">Score</th>
                </tr>
              </thead>
              <tbody>
                {content.leaderboard
                  .sort((a, b) => b.score - a.score)
                  .map((entry, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white">{entry.teamName}</td>
                      <td className="py-3 px-4 text-white text-right">{entry.score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  );
}
`;

    // Create the directory if it doesn't exist
    const dir = path.dirname(templatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the template file
    fs.writeFileSync(templatePath, templateContent);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating template page:', error);
    throw new Error(`Failed to create template page: ${errorMessage}`);
  }
}

export async function getAllCorporateFinanceContent() {
  try {
    const db = await initDB();
    const content = await db.all(`
      SELECT * FROM corporate_finance_content 
      ORDER BY section ASC, createdAt DESC
    `);

    // Convert SQLite boolean (0/1) to JavaScript boolean
    return content.map(item => ({
      ...item,
      includeTitle: Boolean(item.includeTitle),
      includeInstructions: Boolean(item.includeInstructions),
      includeTeams: Boolean(item.includeTeams),
      includeMainActivity: Boolean(item.includeMainActivity),
      includeLeaderboard: Boolean(item.includeLeaderboard)
    }));
  } catch (error) {
    console.error('Error getting corporate finance content:', error);
    throw error;
  }
}

export async function getCorporateFinanceContentById(id: string): Promise<CorporateFinanceContent | null> {
  try {
    console.log('Getting content by ID:', id);
    const db = await initDB();
    
    const content = await db.get(
      `SELECT * FROM corporate_finance_content WHERE id = ? OR internalUrl = ?`,
      [id, id]
    );

    if (!content) {
      console.log('No content found for ID:', id);
      return null;
    }

    // Convert SQLite boolean integers to JavaScript booleans
    const formattedContent: CorporateFinanceContent = {
      ...content,
      includeTitle: Boolean(content.includeTitle),
      includeInstructions: Boolean(content.includeInstructions),
      includeTeams: Boolean(content.includeTeams),
      includeMainActivity: Boolean(content.includeMainActivity),
      includeLeaderboard: Boolean(content.includeLeaderboard),
    };

    console.log('Content retrieved successfully');
    return formattedContent;
  } catch (error) {
    console.error('Error getting content by ID:', error);
    throw error;
  }
}

export async function updateCorporateFinanceContent(id: string, content: Partial<CorporateFinanceContent>) {
  try {
    const db = await initDB();
    
    // Get existing content
    const existingContent = await getCorporateFinanceContentById(id);
    if (!existingContent) {
      throw new Error('Content not found');
    }

    // Update content in database
    const stmt = await db.prepare(`
      UPDATE corporate_finance_content 
      SET section = ?, newSectionName = ?, itemName = ?, linkType = ?, 
          externalUrl = ?, internalUrl = ?, includeTitle = ?, includeInstructions = ?, 
          includeTeams = ?, includeMainActivity = ?, includeLeaderboard = ?,
          titleContent = ?, instructionsContent = ?, teamsContent = ?,
          mainActivityContent = ?, leaderboardContent = ?
      WHERE id = ?
    `);

    try {
      await stmt.run(
        content.section || existingContent.section,
        content.newSectionName || existingContent.newSectionName,
        content.itemName || existingContent.itemName,
        content.linkType || existingContent.linkType,
        content.externalUrl || existingContent.externalUrl,
        content.internalUrl || existingContent.internalUrl,
        content.includeTitle ? 1 : 0,
        content.includeInstructions ? 1 : 0,
        content.includeTeams ? 1 : 0,
        content.includeMainActivity ? 1 : 0,
        content.includeLeaderboard ? 1 : 0,
        content.titleContent || existingContent.titleContent,
        content.instructionsContent || existingContent.instructionsContent,
        content.teamsContent || existingContent.teamsContent,
        content.mainActivityContent || existingContent.mainActivityContent,
        content.leaderboardContent || existingContent.leaderboardContent,
        id
      );
    } finally {
      await stmt.finalize();
    }

    // If this is an internal link, update the template page
    if (content.linkType === 'internal' || existingContent.linkType === 'internal') {
      const templatePath = `/corporate-finance/${content.internalUrl || existingContent.internalUrl || id}`;
      await createTemplatePage({
        ...existingContent,
        ...content,
        templatePath
      });
    }

    return getCorporateFinanceContentById(id);
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

export async function deleteCorporateFinanceContent(id: string) {
  try {
    const db = await initDB();
    
    // Get content before deleting to check if we need to delete the template page
    const content = await getCorporateFinanceContentById(id);
    if (!content) {
      throw new Error('Content not found');
    }

    // Delete content from database
    await db.run('DELETE FROM corporate_finance_content WHERE id = ?', id);

    // If this was an internal link, delete the template page
    if (content.templatePath) {
      const templatePath = `src/app${content.templatePath}/page.tsx`;
      if (fs.existsSync(templatePath)) {
        fs.unlinkSync(templatePath);
        
        // Try to remove the directory if it's empty
        const dir = path.dirname(templatePath);
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          if (files.length === 0) {
            fs.rmdirSync(dir);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function updateAllInternalPages() {
  try {
    console.log('Starting update of all internal pages...');
    const db = await initDB();
    
    // Get all internal pages
    const internalPages = await db.all(`
      SELECT * FROM corporate_finance_content 
      WHERE linkType = 'internal'
    `);

    console.log(`Found ${internalPages.length} internal pages to update`);

    // Convert SQLite boolean (0/1) to JavaScript boolean and update each page
    for (const page of internalPages) {
      const formattedContent: CorporateFinanceContent = {
        ...page,
        includeTitle: Boolean(page.includeTitle),
        includeInstructions: Boolean(page.includeInstructions),
        includeTeams: Boolean(page.includeTeams),
        includeMainActivity: Boolean(page.includeMainActivity),
        includeLeaderboard: Boolean(page.includeLeaderboard),
      };

      // Regenerate the template page with the new format
      const templatePath = `/corporate-finance/${formattedContent.internalUrl || formattedContent.id}`;
      await createTemplatePage({
        ...formattedContent,
        templatePath
      });

      console.log(`Updated template for page: ${templatePath}`);
    }

    console.log('All internal pages updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating internal pages:', error);
    throw error;
  }
}

interface PersonalFinanceContent {
  id: string;
  section: string;
  itemName: string;
  linkType: 'external' | 'internal';
  externalUrl?: string;
  internalUrl?: string;
  templatePath?: string;
  includeTitle: boolean;
  includeInstructions: boolean;
  includeTeams: boolean;
  includeMainActivity: boolean;
  includeLeaderboard: boolean;
  titleContent: string;
  instructionsContent: string;
  teamsContent: string;
  mainActivityContent: string;
  leaderboardContent: string;
  createdAt: string;
}

async function createPersonalFinanceTemplatePage(content: PersonalFinanceContent) {
  try {
    const templatePath = `src/app${content.templatePath}/page.tsx`;
    const templateContent = `
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Team {
  name: string;
  members: string;
}

interface LeaderboardEntry {
  teamName: string;
  score: number;
}

interface TemplateContent {
  title: string;
  instructions: string;
  teams: Team[];
  mainActivity: string;
  leaderboard: LeaderboardEntry[];
}

export default function PersonalFinancePage() {
  const [content, setContent] = useState<TemplateContent>({
    title: "${content.itemName}",
    instructions: "${content.instructionsContent || ''}",
    teams: ${content.teamsContent || '[]'},
    mainActivity: "${content.mainActivityContent || ''}",
    leaderboard: ${content.leaderboardContent || '[]'}
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">{content.title}</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        ${content.includeTitle ? `
        {/* Title Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Title</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">${content.titleContent || ''}</p>
          </div>
        </div>
        ` : ''}

        ${content.includeInstructions ? `
        {/* Instructions Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Instructions</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">{content.instructions}</p>
          </div>
        </div>
        ` : ''}

        ${content.includeTeams ? `
        {/* Teams Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Teams</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white">Team Name</th>
                  <th className="text-left py-3 px-4 text-white">Members</th>
                </tr>
              </thead>
              <tbody>
                {content.teams.map((team, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">{team.name}</td>
                    <td className="py-3 px-4 text-white">{team.members}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        ${content.includeMainActivity ? `
        {/* Main Activity Box */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Main Activity</h2>
          <div className="prose prose-invert">
            <p className="text-white/90 whitespace-pre-line">{content.mainActivity}</p>
          </div>
        </div>
        ` : ''}

        ${content.includeLeaderboard ? `
        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white">Team Name</th>
                  <th className="text-right py-3 px-4 text-white">Score</th>
                </tr>
              </thead>
              <tbody>
                {content.leaderboard
                  .sort((a, b) => b.score - a.score)
                  .map((entry, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white">{entry.teamName}</td>
                      <td className="py-3 px-4 text-white text-right">{entry.score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  );
}
`;

    // Create the directory if it doesn't exist
    const dir = path.dirname(templatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the template file
    fs.writeFileSync(templatePath, templateContent);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating personal finance template page:', error);
    throw new Error(`Failed to create template page: ${errorMessage}`);
  }
}

export async function createPersonalFinanceContent(content: Omit<PersonalFinanceContent, 'id' | 'createdAt'>) {
  try {
    const db = await initDB();
    
    // Generate a unique ID using timestamp and random string
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const id = `${timestamp}-${random}`;
    const createdAt = new Date().toISOString();
    
    // Generate template path for internal links
    const templatePath = content.linkType === 'internal' ? `/personal-finance/${content.internalUrl || id}` : null;

    const stmt = await db.prepare(`
      INSERT INTO personal_finance_content (
        id, section, itemName, linkType, externalUrl, internalUrl, templatePath,
        includeTitle, includeInstructions, includeTeams, includeMainActivity, includeLeaderboard,
        titleContent, instructionsContent, teamsContent, mainActivityContent, leaderboardContent,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      await stmt.run(
        id,
        content.section,
        content.itemName,
        content.linkType,
        content.externalUrl,
        content.internalUrl,
        templatePath,
        content.includeTitle ? 1 : 0,
        content.includeInstructions ? 1 : 0,
        content.includeTeams ? 1 : 0,
        content.includeMainActivity ? 1 : 0,
        content.includeLeaderboard ? 1 : 0,
        content.titleContent,
        content.instructionsContent,
        content.teamsContent,
        content.mainActivityContent,
        content.leaderboardContent,
        createdAt
      );

      // If this is an internal link, create the template page
      if (content.linkType === 'internal') {
        await createPersonalFinanceTemplatePage({
          id,
          ...content,
          createdAt,
          templatePath: templatePath!
        });
      }
    } finally {
      await stmt.finalize();
    }

    return getPersonalFinanceContentById(id);
  } catch (error) {
    console.error('Error creating personal finance content:', error);
    throw error;
  }
}

export async function getPersonalFinanceContentById(id: string): Promise<PersonalFinanceContent | null> {
  try {
    const db = await initDB();
    const content = await db.get('SELECT * FROM personal_finance_content WHERE id = ?', id);

    if (!content) return null;

    return {
      ...content,
      includeTitle: Boolean(content.includeTitle),
      includeInstructions: Boolean(content.includeInstructions),
      includeTeams: Boolean(content.includeTeams),
      includeMainActivity: Boolean(content.includeMainActivity),
      includeLeaderboard: Boolean(content.includeLeaderboard),
    };
  } catch (error) {
    console.error('Error getting personal finance content by ID:', error);
    throw error;
  }
}

export async function getAllPersonalFinanceContent(): Promise<PersonalFinanceContent[]> {
  try {
    const db = await initDB();
    const content = await db.all('SELECT * FROM personal_finance_content ORDER BY createdAt DESC');

    return content.map(item => ({
      ...item,
      includeTitle: Boolean(item.includeTitle),
      includeInstructions: Boolean(item.includeInstructions),
      includeTeams: Boolean(item.includeTeams),
      includeMainActivity: Boolean(item.includeMainActivity),
      includeLeaderboard: Boolean(item.includeLeaderboard),
    }));
  } catch (error) {
    console.error('Error getting all personal finance content:', error);
    throw error;
  }
}

export async function updatePersonalFinanceContent(id: string, content: Partial<PersonalFinanceContent>) {
  try {
    const db = await initDB();
    
    // Get existing content
    const existingContent = await getPersonalFinanceContentById(id);
    if (!existingContent) {
      throw new Error('Content not found');
    }

    // Update content in database
    const stmt = await db.prepare(`
      UPDATE personal_finance_content 
      SET section = ?, itemName = ?, linkType = ?, externalUrl = ?, internalUrl = ?,
          includeTitle = ?, includeInstructions = ?, includeTeams = ?, 
          includeMainActivity = ?, includeLeaderboard = ?, titleContent = ?,
          instructionsContent = ?, teamsContent = ?, mainActivityContent = ?,
          leaderboardContent = ?
      WHERE id = ?
    `);

    try {
      await stmt.run(
        content.section || existingContent.section,
        content.itemName || existingContent.itemName,
        content.linkType || existingContent.linkType,
        content.externalUrl || existingContent.externalUrl,
        content.internalUrl || existingContent.internalUrl,
        content.includeTitle ? 1 : 0,
        content.includeInstructions ? 1 : 0,
        content.includeTeams ? 1 : 0,
        content.includeMainActivity ? 1 : 0,
        content.includeLeaderboard ? 1 : 0,
        content.titleContent || existingContent.titleContent,
        content.instructionsContent || existingContent.instructionsContent,
        content.teamsContent || existingContent.teamsContent,
        content.mainActivityContent || existingContent.mainActivityContent,
        content.leaderboardContent || existingContent.leaderboardContent,
        id
      );
    } finally {
      await stmt.finalize();
    }

    return getPersonalFinanceContentById(id);
  } catch (error) {
    console.error('Error updating personal finance content:', error);
    throw error;
  }
}

export async function deletePersonalFinanceContent(id: string) {
  try {
    const db = await initDB();
    
    // Get content before deleting to check if we need to delete the template page
    const content = await getPersonalFinanceContentById(id);
    if (!content) {
      throw new Error('Content not found');
    }

    // Delete content from database
    await db.run('DELETE FROM personal_finance_content WHERE id = ?', id);

    // If this was an internal link, delete the template page
    if (content.templatePath) {
      const templatePath = `src/app${content.templatePath}/page.tsx`;
      if (fs.existsSync(templatePath)) {
        fs.unlinkSync(templatePath);
        
        // Try to remove the directory if it's empty
        const dir = path.dirname(templatePath);
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          if (files.length === 0) {
            fs.rmdirSync(dir);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting personal finance content:', error);
    throw error;
  }
}

export default prisma;