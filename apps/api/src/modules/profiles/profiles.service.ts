import { ForbiddenException, Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';

import { PrismaService } from '../../shared/database/prisma.service';
import { AuthContext } from '../../common/decorators/current-user.decorator';
import { CreateProfileDTO } from './dto/create-profile.dto';

type CreateProfileInput = {
  user: AuthContext;
  payload: CreateProfileDTO;
};

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Creates a profile for the authenticated user within their organization.
   *
   * Uses the organization context provided by the session.
   */
  async createProfile({
    user,
    payload,
  }: CreateProfileInput): Promise<Profile> {
    const { userId, organizationId } = user;

    if (!organizationId) {
      throw new ForbiddenException(
        'You must select or create an organization before performing this action',
      );
    }

    return this.prisma.profile.create({
      data: {
        ownerUserId: userId,
        organizationId: organizationId,
        ...payload,
      },
    });
  }
}
