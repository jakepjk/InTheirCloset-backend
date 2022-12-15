import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateKakaoUser(userLoginDto: UserLoginDto): Promise<User> {
    const { platformId } = userLoginDto;
    const user = await this.userRepository.findOne({
      where: { platformId: platformId },
    });
    if (user) {
      return user;
    }
    const newUser = await this.userRepository.save(
      this.userRepository.create({ ...userLoginDto }),
    );
    return newUser;
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
