import { Controller, Post, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialLoginDto } from '@/auth/dto/credential-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: CredentialLoginDto) {
    const user = await this.authService.validateUserEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'The email address does not exist in the system.',
      });
    }

    return await this.authService.validateUserCredentials(dto);
  }
}
