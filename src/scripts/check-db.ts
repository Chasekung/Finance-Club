import { initDB } from '@/lib/db';

async function checkDatabase() {
  try {
    const db = await initDB();
    const users = await db.all('SELECT * FROM users');
    console.log('Database contents:');
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error reading database:', error);
  }
}

checkDatabase(); 