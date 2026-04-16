import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from '../../configs/env';

dotenv.config();

async function clearDatabase() {
  if (!process.argv.includes('--force')) {
    console.error(
      'Refusing to clear database without --force. Usage: npm run db:clear -- --force',
    );
    process.exit(1);
  }

  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.databaseUrl,
    }),
  });

  try {
    const tableRows = await prisma.$queryRawUnsafe<
      Array<{ tablename: string }>
    >(
      `
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename <> '_prisma_migrations'
      ORDER BY tablename;
      `,
    );

    const tables = tableRows.map((row) => row.tablename);

    if (tables.length === 0) {
      console.log('No tables found to clear.');
      return;
    }

    const quotedTables = tables
      .map((table) => `"public"."${table}"`)
      .join(', ');

    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE;`,
    );

    console.log(`Cleared ${tables.length} table(s): ${tables.join(', ')}`);
  } finally {
    await prisma.$disconnect();
  }
}

void clearDatabase();
