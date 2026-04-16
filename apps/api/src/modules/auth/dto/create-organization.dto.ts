import { IsString, MinLength, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  userId!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and dashes',
  })
  slug!: string;
}
