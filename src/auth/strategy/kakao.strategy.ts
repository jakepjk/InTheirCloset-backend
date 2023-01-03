import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginDto } from 'src/users/dto/user-login.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile, done) {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const payload: UserLoginDto = {
      platformId: profileJson.id,
      platform: 'kakao',
      nickname: kakao_account.profile.nickname,
      gender: kakao_account.gender_needs_agreement
        ? null
        : kakao_account.gender,
      ageRange: kakao_account.age_range_needs_agreement
        ? null
        : kakao_account.age_range,
    };

    const user = this.authService.validateKakaoUser(payload);

    done(null, user);
  }
}
