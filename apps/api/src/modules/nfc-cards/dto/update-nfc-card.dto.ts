import { NfcCardType, NfcCardStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateNfcCardDTO {
  @IsOptional()
  @IsString()
  hardwareId?: string;

  @IsOptional()
  @IsEnum(NfcCardType)
  cardType?: NfcCardType;

  @IsOptional()
  @IsEnum(NfcCardStatus)
  status?: NfcCardStatus;

  @IsOptional()
  @IsString()
  profileId?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
