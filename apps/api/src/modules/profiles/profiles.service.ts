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

  /**
   * Updates a profile for the authenticated user within their organization.
   *
   * Uses the organization context provided by the session.
   */
  async updateProfile(
    user: AuthContext,
    id: string,
    payload: Partial<Profile>,
  ): Promise<Profile> {
    const { organizationId } = user;

    if (!organizationId) {
      throw new ForbiddenException(
        'You must select or create an organization before performing this action',
      );
    }

    // Ensure the profile belongs to the user's organization
    const existingProfile = await this.prisma.profile.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!existingProfile) {
      throw new ForbiddenException(
        'You do not have permission to update this profile',
      );
    }

    return this.prisma.profile.update({
      where: { id },
      data: payload,
    });
  }
}
