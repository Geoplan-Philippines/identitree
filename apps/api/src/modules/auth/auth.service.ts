/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { auth } from '../../configs/auth';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    try {
      // Use Better Auth's sign-up method
      // Better Auth handles password hashing, validation, and user creation
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });

      // Better Auth returns the user and token on success
      return result;
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
      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to login user';
      throw new BadRequestException(message);
    }
  }
}
