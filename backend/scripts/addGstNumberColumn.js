import dotenv from 'dotenv';
import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

dotenv.config();

const addGstNumberColumn = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected...');

    // Check if column already exists
    const checkColumn = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name='users' AND column_name='gstNumber'`,
      { type: QueryTypes.SELECT }
    );

    if (checkColumn.length > 0) {
      console.log('✓ GST Number column already exists');
      process.exit(0);
    }

    // Add the column
    await sequelize.query(
      `ALTER TABLE users ADD COLUMN "gstNumber" VARCHAR(255)`,
      { type: QueryTypes.RAW }
    );

    console.log('✅ GST Number column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding GST Number column:', error);
    process.exit(1);
  }
};

addGstNumberColumn();

