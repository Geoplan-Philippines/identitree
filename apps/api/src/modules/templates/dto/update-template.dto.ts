import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateTemplateDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  layoutKey?: string;

  @IsOptional()
  @IsObject()
  config?: any;
}
