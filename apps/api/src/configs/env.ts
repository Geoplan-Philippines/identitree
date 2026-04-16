import dotenv from 'dotenv';

dotenv.config();

export const env = {
  databaseUrl: process.env.DATABASE_URL || '',
  port: Number(process.env.PORT || 8000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  authSecret: process.env.BETTER_AUTH_SECRET || '',
  authUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
};
