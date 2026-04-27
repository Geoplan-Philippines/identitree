
import { NfcCardType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNfcCardDTO {
  @IsOptional()
  @IsString()
  hardwareId?: string;


  @IsNotEmpty()
  @IsEnum(NfcCardType)
  cardType!: NfcCardType;

  @IsNotEmpty()
  @IsString()
  name!: string;
}
