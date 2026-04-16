import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from './env';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    if (!env.databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }

    super({
      adapter: new PrismaPg({
        connectionString: env.databaseUrl,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Connected to PostgreSQL database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
