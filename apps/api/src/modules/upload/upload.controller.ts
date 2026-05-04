import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../shared/cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const result = await this.cloudinaryService.uploadImage(file, folder);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
