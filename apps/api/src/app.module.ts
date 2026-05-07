import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { PrismaService } from './shared/database/prisma.service';
import { NfcCardsModule } from './modules/nfc-cards/nfc-cards.module';
import { RateLimitModule } from './common/decorators/rate-limit.decorator';
import { UploadModule } from './modules/upload/upload.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TemplatesModule } from './modules/templates/templates.module';

@Module({
  imports: [
    AuthModule,
    ProfilesModule,
    NfcCardsModule,
    RateLimitModule,
    UploadModule,
    AnalyticsModule,
    NotificationsModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
