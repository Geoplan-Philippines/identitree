
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class LinkHardwareDTO {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  encodedUrl!: string;

  @IsNotEmpty()
  @IsString()
  hardwareId!: string;
}
