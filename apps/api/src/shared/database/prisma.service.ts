import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from './prisma';

@Injectable()
export class PrismaService
  implements OnModuleInit, OnModuleDestroy
{
  readonly $prisma = prisma;

  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }

  // Delegate all PrismaClient calls to the shared instance
  get user() { return prisma.user; }
  get profile() { return prisma.profile; }
  get organization() { return prisma.organization; }
  get member() { return prisma.member; }
  get invitation() { return prisma.invitation; }
  get session() { return prisma.session; }
  get account() { return prisma.account; }
  get verification() { return prisma.verification; }
  get nfcCard() { return prisma.nfcCard; }
  get $queryRaw() { return prisma.$queryRaw.bind(prisma); }
  get $executeRaw() { return prisma.$executeRaw.bind(prisma); }
  get $transaction() { return prisma.$transaction.bind(prisma); }
  get $connect() { return prisma.$connect.bind(prisma); }
  get $disconnect() { return prisma.$disconnect.bind(prisma); }
}
