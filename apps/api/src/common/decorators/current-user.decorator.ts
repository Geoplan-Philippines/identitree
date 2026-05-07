import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from '../../configs/auth';
import { prisma } from '../../shared/database/prisma';

export type AuthContext = {
  userId: string;
  organizationId: string | null;
};

/**
 * Extracts the authenticated user's context (ID and active organization) from the Better Auth session.
 *
 * Usage:
 *   async myHandler(@CurrentUser() user: AuthContext) { ... }
 *
 * Throws UnauthorizedException if no valid session is present.
 */
export const CurrentUser = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<AuthContext> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session?.user?.id) {
      throw new UnauthorizedException(
        'You must be logged in to perform this action',
      );
    }

    let organizationId = session.session.activeOrganizationId || null;

    // Fallback: If no active organization is set in the session,
    // automatically pick the first one the user belongs to.
    if (!organizationId) {
      const member = await prisma.member.findFirst({
        where: { userId: session.user.id },
        select: { organizationId: true },
        orderBy: { createdAt: 'asc' },
      });

      if (member) {
        organizationId = member.organizationId;

        // Persist this choice to the session record so subsequent calls are faster
        await prisma.session.update({
          where: { id: session.session.id },
          data: { activeOrganizationId: organizationId },
        }).catch(err => {
          console.error('Failed to auto-set active organization in session:', err);
        });
      }
    }

    return {
      userId: session.user.id,
      organizationId,
    };
  },
);
