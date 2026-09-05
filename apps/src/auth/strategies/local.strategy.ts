import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/auth/auth.service';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const allowedEmailAccount = await this.authService.validateUserEmail(email);

    if (!allowedEmailAccount) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error:
            'This email address is invited to use Spotlight. please contact the admin to be added to the system.',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: "Email address doesn't exist in the system.",
        },
      );
    }
    const user = await this.authService.validateUserCredentials({
      email,
      password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
