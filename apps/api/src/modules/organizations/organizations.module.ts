import { Module } from '@nestjs/common';

import { PrismaService } from '../../shared/database/prisma.service';
import { OrganizationsService } from './organizations.service';

@Module({
  providers: [OrganizationsService, PrismaService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
