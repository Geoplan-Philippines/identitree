import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';

export class CreateTemplateDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsString()
  layoutKey!: string;

  @IsOptional()
  @IsObject()
  config?: any;
}
