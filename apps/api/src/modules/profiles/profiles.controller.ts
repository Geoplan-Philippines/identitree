import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Profile } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthContext } from '../../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { ProfilesService } from './profiles.service';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('profiles')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  /**
   * Creates a profile for the authenticated user under their organization.
   */
  @RateLimit(10, 60000)
  @Post()
  async createProfile(
    @CurrentUser() user: AuthContext,
    @Body() createProfileDTO: CreateProfileDTO,
  ): Promise<Profile> {
    return this.profilesService.createProfile({
      user,
      payload: createProfileDTO,
    });
  }
}
