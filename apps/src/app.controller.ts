import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { CredentialLoginDto } from '@/auth/dto/credential-login.dto';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: CredentialLoginDto) {
    const user = await this.authService.validateUserEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'The email address does not exist in the system.',
      });
    }

    return await this.authService.login(dto);
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }
}
