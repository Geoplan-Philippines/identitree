import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';

import { PrismaService } from '../../shared/database/prisma.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateProfileDTO } from './dto/create-profile.dto';

type CreateProfileInput = {
  currentUserId: string;
  payload: CreateProfileDTO;
};

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  /**
   * Creates a profile for the authenticated user within their organization.
   *
   * Resolves the organization first, then persists the profile with the
   * resolved organizationId and the caller's userId as the owner.
   */
  async createProfile({
    currentUserId,
    payload,
  }: CreateProfileInput): Promise<Profile> {
    const organization =
      await this.organizationsService.resolveUserOrganization(currentUserId);

    return this.prisma.profile.create({
      data: {
        ownerUserId: currentUserId,
        organizationId: organization.id,
        ...payload,
      },
    });
  }
}
