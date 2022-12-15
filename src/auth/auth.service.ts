import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateKakaoUser(userLoginDto: UserLoginDto): Promise<User> {
    const { platformId, platform } = userLoginDto;

    const user = await this.usersService.findByPlatform({
      platformId,
      platform,
    });
    if (user) {
      return user;
    }

    return await this.usersService.create(userLoginDto);
  }

  async login(userLoginDto: UserLoginDto): Promise<any> {
    const payload = {
      platform: userLoginDto.platform,
      platformId: userLoginDto.platformId,
      nickname: userLoginDto.nickname,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
