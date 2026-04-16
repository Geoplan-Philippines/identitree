import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../../configs/database';

@Module({
  controllers: [AuthController],
  providers: [AuthService, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
