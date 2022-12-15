import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(userLoginDto: UserLoginDto): Promise<User> {
    const newUser = await this.userRepository.save(
      this.userRepository.create({ ...userLoginDto }),
    );
    return newUser;
  }

  async findByPlatform({
    platformId,
    platform,
  }: {
    platformId: string;
    platform: string;
  }): Promise<User> {
    return await this.userRepository.findOne({
      where: { platformId: platformId, platform: platform },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
