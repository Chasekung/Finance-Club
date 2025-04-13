import { initDB } from '@/lib/db';

async function addAdminColumn() {
  try {
    const db = await initDB();
    
    // Add isAdmin column if it doesn't exist
    await db.run(`
      ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT FALSE
    `);

    console.log('Added isAdmin column to users table');
  } catch (error) {
    console.error('Error adding column:', error);
  }
}

addAdminColumn(); 