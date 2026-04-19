import { Module } from '@nestjs/common';

import { PrismaService } from '../../shared/database/prisma.service';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [OrganizationsModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, PrismaService],
})
export class ProfilesModule {}
