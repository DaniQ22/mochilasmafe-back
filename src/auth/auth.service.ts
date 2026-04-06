import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config({
  override: true,
});

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(username: string, password: string): { token: string } {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    console.log('Intento de login con:', { expectedPassword, expectedUsername });

    if (
      !expectedUsername ||
      !expectedPassword ||
      username !== expectedUsername ||
      password !== expectedPassword
    ) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const token = this.jwtService.sign({ sub: 'admin', username });
    return { token };
  }
}
