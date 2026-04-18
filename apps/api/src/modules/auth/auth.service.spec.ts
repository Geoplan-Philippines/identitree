import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { auth } from '../../configs/auth';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';

jest.mock('../../configs/auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  let service: AuthService;
  let db: {
    member: {
      findFirst: jest.Mock;
    };
    organization: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  const mockedAuth = auth as unknown as {
    api: {
      signUpEmail: jest.Mock;
      signInEmail: jest.Mock;
    };
  };

  beforeEach(() => {
    db = {
      member: {
        findFirst: jest.fn(),
      },
      organization: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    service = new AuthService(db as unknown as PrismaService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('creates a user and returns the organization slug when the user already has one', async () => {
      const dto: RegisterDto = {
        email: 'jane@example.com',
        password: 'supersecret',
        name: 'Jane Doe',
      };

      mockedAuth.api.signUpEmail.mockResolvedValue({
        token: 'register-token',
        user: {
          id: 'user-1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: null,
          emailVerified: true,
        },
      });
      db.member.findFirst.mockResolvedValue({
        organization: { slug: 'identitree' },
      });

      await expect(service.register(dto)).resolves.toEqual({
        token: 'register-token',
        user: {
          id: 'user-1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: null,
          emailVerified: true,
        },
        organizationSlug: 'identitree',
      });

      expect(mockedAuth.api.signUpEmail).toHaveBeenCalledWith({
        body: {
          email: 'jane@example.com',
          password: 'supersecret',
          name: 'Jane Doe',
        },
      });
    });

    it('wraps Better Auth errors in a bad request response', async () => {
      const dto: RegisterDto = {
        email: 'jane@example.com',
        password: 'supersecret',
        name: 'Jane Doe',
      };

      mockedAuth.api.signUpEmail.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(service.register(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('signs in a user and returns null organization when no membership exists', async () => {
      const dto: LoginDto = {
        email: 'jane@example.com',
        password: 'supersecret',
      };

      mockedAuth.api.signInEmail.mockResolvedValue({
        token: 'login-token',
        user: {
          id: 'user-2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: null,
          emailVerified: true,
        },
      });
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.login(dto)).resolves.toEqual({
        token: 'login-token',
        user: {
          id: 'user-2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          image: null,
          emailVerified: true,
        },
        organizationSlug: null,
      });

      expect(mockedAuth.api.signInEmail).toHaveBeenCalledWith({
        body: {
          email: 'jane@example.com',
          password: 'supersecret',
        },
      });
    });

    it('wraps invalid credentials in a bad request response', async () => {
      const dto: LoginDto = {
        email: 'jane@example.com',
        password: 'supersecret',
      };

      mockedAuth.api.signInEmail.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('getUserOrganization', () => {
    it('returns false when the user does not belong to any organization', async () => {
      db.member.findFirst.mockResolvedValue(null);

      await expect(service.getUserOrganization('user-3')).resolves.toEqual({
        organizationSlug: null,
        hasOrganization: false,
      });
    });
  });

  describe('createOrganization', () => {
    it('rejects duplicate organization slugs', async () => {
      const dto: CreateOrganizationDto = {
        userId: 'user-4',
        name: 'Identitree',
        slug: 'identitree',
      };

      db.organization.findUnique.mockResolvedValue({
        slug: 'identitree',
      });

      await expect(service.createOrganization(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('returns the existing organization when the user is already a member', async () => {
      const dto: CreateOrganizationDto = {
        userId: 'user-5',
        name: 'Identitree',
        slug: 'identitree',
      };

      db.organization.findUnique.mockResolvedValue(null);
      db.member.findFirst.mockResolvedValue({
        organization: { slug: 'existing-org' },
      });

      await expect(service.createOrganization(dto)).resolves.toEqual({
        organizationSlug: 'existing-org',
        alreadyMember: true,
      });

      expect(db.organization.create).not.toHaveBeenCalled();
    });

    it('creates a new organization for users without one', async () => {
      const dto: CreateOrganizationDto = {
        userId: 'user-6',
        name: 'Identitree',
        slug: 'identitree',
      };

      db.organization.findUnique.mockResolvedValue(null);
      db.member.findFirst.mockResolvedValue(null);
      db.organization.create.mockResolvedValue({ slug: 'identitree' });

      await expect(service.createOrganization(dto)).resolves.toEqual({
        organizationSlug: 'identitree',
        alreadyMember: false,
      });

      expect(db.organization.create).toHaveBeenCalledWith({
        data: {
          name: 'Identitree',
          slug: 'identitree',
          members: {
            create: {
              userId: 'user-6',
              role: 'owner',
            },
          },
        },
      });
    });
  });
});
