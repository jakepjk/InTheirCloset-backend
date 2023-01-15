import { Controller, Get, Req, Res, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOAuth2 } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao/login')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin(): any {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    // these are the user details passed from the Kakao.strategy.ts file
    const user = req.user as User;

    // above details can be used to generate a token and send back to the Client
    const { accessToken } = await this.authService.login(user);

    const { platform, platformId, nickname, gender, role } = user;

    const data = {
      platform,
      platformId,
      nickname,
      gender,
      role,
    };

    return { accessToken, data };
  }
}
