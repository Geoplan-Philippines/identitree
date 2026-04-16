import { Injectable, BadRequestException } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';
import { DatabaseService } from '../../configs/database';

import { RegisterDto } from './dto/register.dto';
import { auth } from '../../configs/auth';
import { env } from '../../configs/env';
import { LoginDto } from './dto/login.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';

type AuthResult = {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
};

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  private async findOrganizationSlugByUserId(userId: string) {
    const member = await this.db.member.findFirst({
      where: { userId },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    });

    return member?.organization.slug ?? null;
  }

  private async withOrganization(result: AuthResult) {
    const organizationSlug = await this.findOrganizationSlugByUserId(
      result.user.id,
    );

    return {
      ...result,
      organizationSlug,
    };
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    try {
      // Use Better Auth's sign-up method
      // Better Auth handles password hashing, validation, and user creation
      const result = (await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      })) as AuthResult;

      // Better Auth returns the user and token on success
      return this.withOrganization(result);
    } catch (error) {
      // Better Auth throws errors on failure
      const message =
        error instanceof Error ? error.message : 'Failed to register user';
      throw new BadRequestException(message);
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    try {
      const result = (await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      })) as AuthResult;

      return this.withOrganization(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to login user';
      throw new BadRequestException(message);
    }
  }

  async getUserOrganization(userId: string) {
    const organizationSlug = await this.findOrganizationSlugByUserId(userId);

    return {
      organizationSlug,
      hasOrganization: Boolean(organizationSlug),
    };
  }

  async createOrganization(dto: CreateOrganizationDto) {
    const { userId, name, slug } = dto;

    const existingOrganization = await this.db.organization.findUnique({
      where: { slug },
    });

    if (existingOrganization) {
      throw new BadRequestException('Organization slug already exists');
    }

    const existingMembership = await this.db.member.findFirst({
      where: { userId },
      include: { organization: true },
    });

    if (existingMembership) {
      return {
        organizationSlug: existingMembership.organization.slug,
        alreadyMember: true,
      };
    }

    const organization = await this.db.organization.create({
      data: {
        name,
        slug,
        members: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });

    return {
      organizationSlug: organization.slug,
      alreadyMember: false,
    };
  }

  async getVerificationTokenStatus(token: string) {
    try {
      const jwt = await jwtVerify(
        token,
        new TextEncoder().encode(env.authSecret),
        {
          algorithms: ['HS256'],
        },
      );
      const payload = jwt.payload as { email?: string };
      const email = payload.email?.toLowerCase();

      if (!email) {
        return { status: 'invalid' } as const;
      }

      const user = await this.db.user.findUnique({
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
      if (error instanceof JWTExpired) {
        return { status: 'expired' } as const;
      }

      return { status: 'invalid' } as const;
    }
  }
}
