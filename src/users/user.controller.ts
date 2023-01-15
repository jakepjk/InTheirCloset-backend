import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/role/role.decorator';
import { ApiHeaders } from '@nestjs/swagger';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Role(['Any'])
  @Get('profile')
  MyProfile(@AuthUser() user: User): Promise<UserProfileDto> {
    return this.usersService.findById(user);
  }
}
