import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { Platform } from 'src/users/entities/user.entity';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile, done) {
    const profileJson = profile._json;

    console.log(profileJson);

    const payload: UserLoginDto = {
      platformId: profileJson.id,
      platform: Platform.Naver,
      nickname: profile.nickname,
    };

    const user = this.authService.validateKakaoUser(payload);

    done(null, user);
  }
}
