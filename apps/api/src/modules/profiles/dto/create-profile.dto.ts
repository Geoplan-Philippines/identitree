import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProfileDTO {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsNotEmpty()
  @IsString()
  positionTitle!: string;

  @IsNotEmpty()
  @IsString()
  contactNumber!: string;

  @IsOptional()
  @IsString()
  linkedInUsername?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  viberNumber?: string;
}
