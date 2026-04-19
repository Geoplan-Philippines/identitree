import { ForbiddenException, Injectable } from '@nestjs/common';
import { Organization } from '@prisma/client';

import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the organization that the given user belongs to.
   *
   * Picks the earliest membership if a user belongs to multiple orgs.
   * Throws ForbiddenException if the user has no organization yet.
   */
  async resolveUserOrganization(currentUserId: string): Promise<Organization> {
    const member = await this.prisma.member.findFirst({
      where: { userId: currentUserId },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!member?.organization) {
      throw new ForbiddenException(
        'Create an organization before performing this action',
      );
    }

    return member.organization;
  }
}
