import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { Platform, User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

enum UserError {
  UserNotExist = '유저 정보가 없습니다.',
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * @param userLoginDto
   * @returns User
   */
  async create(userLoginDto: UserLoginDto): Promise<User> {
    const newUser = await this.userRepository.save(
      this.userRepository.create({ ...userLoginDto }),
    );
    return newUser;
  }

  /**
   *
   * @param param0
   * @returns UserProfileDto
   */
  async findByPlatform({
    platformId,
    platform,
  }: {
    platformId: string;
    platform: Platform;
  }): Promise<UserProfileDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { platformId: platformId, platform: platform },
      });
      if (!user) return { ok: false, error: UserError.UserNotExist };
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById({ id }: User) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) return { ok: false, error: UserError.UserNotExist };
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
