import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDto } from 'src/users/dto/user-login.dto';

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
    const user = req.user as UserLoginDto;

    // above details can be used to generate a token and send back to the Client
    const { accessToken } = await this.authService.login(user);

    const { platformId, nickname, gender, age_range } = user;

    const data = {
      platformId,
      nickname,
      gender,
      age_range,
    };

    return { accessToken, data };
  }
}
