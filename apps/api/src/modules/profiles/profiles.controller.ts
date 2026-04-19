import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Profile } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { ProfilesService } from './profiles.service';
import { CreateProfileDTO } from './dto/create-profile.dto';

@Controller('profiles')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * Creates a profile for the authenticated user under their organization.
   */
  @Post()
  async createProfile(
    @CurrentUser() currentUserId: string,
    @Body() createProfileDTO: CreateProfileDTO,
  ): Promise<Profile> {
    return this.profilesService.createProfile({
      currentUserId,
      payload: createProfileDTO,
    });
  }
}
