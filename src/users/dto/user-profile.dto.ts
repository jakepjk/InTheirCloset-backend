import { OmitType, PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/common/dto/common.dto';
import { User } from 'src/users/entities/user.entity';

export class UserProfileDto extends CommonDto {
  user?: User;
}
