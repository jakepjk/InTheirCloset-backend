import { Apparel } from 'src/apparel/entities/apparel.entity';
import { CommonDto } from 'src/common/dto/common.dto';
import { PageDto } from 'src/common/dto/page.dto';

export class GetApparelsDto extends CommonDto {
  page?: PageDto;
  apparels?: Apparel[];
}

export class GetApparelDetailDto extends CommonDto {
  media?: Apparel;
}
