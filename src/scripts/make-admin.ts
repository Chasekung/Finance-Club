import { initDB } from '@/lib/db';

async function makeAdmin(username: string) {
  try {
    const db = await initDB();
    
    // Update user to admin
    const result = await db.run(
      'UPDATE users SET isAdmin = TRUE WHERE username = ?',
      username
    );

    if (result.changes === 0) {
      console.log('User not found');
    } else {
      console.log(`User ${username} is now an admin`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Make chasekung an admin
makeAdmin('chasekung'); 