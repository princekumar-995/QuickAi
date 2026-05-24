import { neon } from '@neondatabase/serverless';

const isPlaceholder = !process.env.DATABASE_URL || 
                      process.env.DATABASE_URL.includes("host") || 
                      process.env.DATABASE_URL.includes("password");

let sql;
if (isPlaceholder) {
  console.warn("⚠️ Database URL is a placeholder or not provided. Database operations will be bypassed gracefully.");
  // Dummy template tag that does nothing and returns successfully
  sql = async (strings, ...values) => {
    return [];
  };
} else {
  try {
    sql = neon(process.env.DATABASE_URL);
  } catch (err) {
    console.error("⚠️ Failed to initialize Neon database client:", err.message);
    sql = async (strings, ...values) => {
      return [];
    };
  }
}

export default sql;

