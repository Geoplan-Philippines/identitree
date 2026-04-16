import { Body, Controller, Post, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { auth } from '../../configs/auth';
import { LoginDto } from './dto/login.dto';

const nodeAuthHandler = toNodeHandler(auth);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Let Better Auth handle all auth routes
  @All('*')
  async handler(@Req() req: Request, @Res() res: Response) {
    return nodeAuthHandler(req, res);
  }
}
