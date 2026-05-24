import sql from '../server/configs/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../server/.env' });

async function testConnection() {
  try {
    console.log("Testing database connection using DATABASE_URL:", process.env.DATABASE_URL);
    const result = await sql`SELECT 1 as connected`;
    console.log("Database connection successful:", result);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testConnection();
