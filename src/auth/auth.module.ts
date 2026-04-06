import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import * as dotenv from 'dotenv';

dotenv.config({
  override: true,
});

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'fallback-secret-change-me',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtGuard, JwtModule],
})
export class AuthModule {}
