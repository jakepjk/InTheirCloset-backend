import { OmitType, PickType } from '@nestjs/mapped-types';
import { User } from 'src/users/entities/user.entity';

export class UserLoginDto extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
  'role',
]) {}
