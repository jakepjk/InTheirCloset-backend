import { CommonDto } from 'src/common/dto/common.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Media } from 'src/media/entities/media.entity';

export class GetMediasDto extends CommonDto {
  page?: PageDto;
  medias?: Media[];
}

export class GetMediaDetailDto extends CommonDto {
  media?: Media;
}
