import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { CredentialLoginDto } from '@/auth/dto/credential-login.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @ApiBody({ type: CredentialLoginDto })
  async login(@Body() dto: CredentialLoginDto) {
    const user = await this.authService.validateUserEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'The email address does not exist in the system.',
      });
    }

    return await this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Logged out successfully' })
  @HttpCode(204)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body('refresh_token') refreshToken: string) {
    await this.authService.logout(refreshToken);

    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }
}
