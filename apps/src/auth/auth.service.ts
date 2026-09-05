import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import bcrypt from 'bcrypt';
import { CredentialDto } from './dto/credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { JwtPayloadInterface } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Validates the user email and returns true if it exists. */
  async validateUserEmail(email: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Validates the user credentials (email and password) and returns the user
   * if they are valid.
   */
  async validateUserCredentials(cred: CredentialDto): Promise<JwtTokenDto> {
    const user = await this.usersService.findByEmail(cred.email);
    if (user && (await bcrypt.compare(cred.password, user.password))) {
      const payload: JwtPayloadInterface = {
        username: user.name,
        sub: user.id,
      };
      return {
        user: user,
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException({
      message: 'These credentials do not match our records.',
    });
  }
}
