import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from '../../configs/auth';

/**
 * Extracts the authenticated user's ID from the Better Auth session.
 *
 * Usage:
 *   async myHandler(@CurrentUser() userId: string) { ... }
 *
 * Throws UnauthorizedException if no valid session is present.
 */
export const CurrentUser = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<string> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session?.user?.id) {
      throw new UnauthorizedException(
        'You must be logged in to perform this action',
      );
    }

    return session.user.id;
  },
);
