import { PartialType, PickType } from '@nestjs/mapped-types';
import { Apparel } from 'src/apparel/entities/apparel.entity';
import { CommonDto } from 'src/common/dto/common.dto';
import { Media, MediaType } from 'src/media/entities/media.entity';

export interface RequestApparelBodyDto {
  apparel: Apparel;
}

export class RequestApparelDto extends CommonDto {}
