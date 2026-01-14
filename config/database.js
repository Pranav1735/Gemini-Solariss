import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD), // FORCE string
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: !isProduction,

    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {},

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
