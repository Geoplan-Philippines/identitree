import { Injectable } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';

import { env } from '../../configs/env';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getVerificationTokenStatus(token: string) {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: { value: token },
      });

      if (!verification) {
        return { status: 'invalid' } as const;
      }

      if (verification.expiresAt < new Date()) {
        return { status: 'expired' } as const;
      }

      const email = verification.identifier;
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { status: 'invalid' } as const;
      }

      if (user.emailVerified) {
        return { status: 'already-verified', email: user.email } as const;
      }

      return { status: 'ready', email: user.email } as const;
    } catch (error) {
      console.error('Error checking verification token status:', error);
      return { status: 'invalid' } as const;
    }
  }
}
