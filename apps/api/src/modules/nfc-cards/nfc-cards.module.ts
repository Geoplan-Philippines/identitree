import { Module } from '@nestjs/common';

import { PrismaService } from '../../shared/database/prisma.service';
import { OrganizationsModule } from '../organizations/organizations.module';
import { NfcCardsController } from './nfc-cards.controller';
import { NfcCardsService } from './nfc-cards.service';

@Module({
  imports: [OrganizationsModule],
  controllers: [NfcCardsController],
  providers: [NfcCardsService, PrismaService],
})
export class NfcCardsModule {}
