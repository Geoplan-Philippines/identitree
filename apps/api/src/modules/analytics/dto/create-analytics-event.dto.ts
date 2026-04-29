import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AnalyticsChannel, AnalyticsEventType } from '@prisma/client';

export class CreateAnalyticsEventDto {
  @IsNotEmpty()
  @IsString()
  profileId: string;

  @IsOptional()
  @IsString()
  nfcCardId?: string;

  @IsEnum(AnalyticsEventType)
  eventType: AnalyticsEventType;

  @IsEnum(AnalyticsChannel)
  channel: AnalyticsChannel;

  @IsOptional()
  @IsString()
  visitorIp?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}
