import { PartialType, PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/common/dto/common.dto';
import { Media, MediaType } from 'src/media/entities/media.entity';

export interface RequestMediaBodyDto {
  media: Media;
}

export class RequestMediaDto extends CommonDto {}
