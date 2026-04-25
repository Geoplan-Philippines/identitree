import {
  Controller,
  All,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { toNodeHandler } from 'better-auth/node';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/database/prisma.service';
import { auth } from '../../configs/auth';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('auth')
export class AuthController {
  private readonly nodeAuthHandler: (req: Request, res: Response) => unknown;

  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {
    // Use the singleton Better Auth instance
    this.nodeAuthHandler = toNodeHandler(auth);
  }

  @RateLimit(20, 60000)
  @Get('verify-email-status/:token')
  async getVerificationTokenStatus(@Param('token') token: string) {
    return this.authService.getVerificationTokenStatus(token);
  }

  @RateLimit(20, 60000)
  @Post('verify-email')
  async verifyEmail(@Body() body: { token: string }) {
    // We omit callbackURL here to prevent Better Auth from throwing a Redirect error.
    // Instead, we return the JSON result so the frontend can handle the UI state.
    return auth.api.verifyEmail({
      query: {
        token: body.token,
      },
    });
  }

  // Let Better Auth handle all auth routes
  @RateLimit(60, 60000)
  @All('*')
  handler(@Req() req: Request, @Res() res: Response): unknown {
    return this.nodeAuthHandler(req, res);
  }

}
