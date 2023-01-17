import { CommonDto } from 'src/common/dto/common.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';

export class GetRequestMediaDto extends CommonDto {
  requestMedia?: RequestMedia[];
  page?: PageDto;
}
