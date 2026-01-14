import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;
dotenv.config();

const createDatabase = async () => {
  // Connect to default 'postgres' database to create our database
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Connect to default database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL...');

    const dbName = process.env.DB_NAME || 'gemini_solariss';

    // Check if database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      // Create database
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`✅ Database "${dbName}" already exists.`);
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  }
};

createDatabase();

