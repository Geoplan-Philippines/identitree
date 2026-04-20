import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from '../../configs/env';

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

/**
 * Global PrismaClient instance shared across the application.
 * This ensures we use a single connection pool and same database state
 * both within NestJS DI context and outside (decorators, helpers).
 */
export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.databaseUrl,
  }),
});
