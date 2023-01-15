import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_LIMIT } from 'src/common/common.constants';
import { PageDto, PageError } from 'src/common/dto/page.dto';
import { GetMediaDetailDto, GetMediasDto } from 'src/media/dto/get-media';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { And, Any, ArrayContains, In, Like, Repository } from 'typeorm';

enum MediaError {
  MediaNotExist = '미디어 정보가 없습니다',
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}
  // create(createMediaDto: CreateMediaDto) {
  //   return 'This action adds a new media';
  // }

  async findAll(
    type: MediaType,
    search?: string,
    limit?: number,
    page?: number,
  ): Promise<GetMediasDto> {
    search = search ?? '';
    if (limit < 1)
      return { ok: false, error: PageError.LimitMustBeNaturalNumber };
    try {
      const [medias, count] = await this.mediaRepository.findAndCount({
        where: [
          { type, title: Like(`%${search}%`) },
          { type, subtitle: Like(`%${search}%`) },
          { type, season: Like(`%${search}%`) },
          { type, genre: ArrayContains([search]) },
        ],
        skip: (limit ?? DEFAULT_LIMIT) * ((page ?? 1) - 1),
        take: limit,
        order: { updatedAt: 'DESC' },
      });

      const pageInfo: PageDto = {
        total: Math.ceil(count / (limit ?? DEFAULT_LIMIT)),
        current: page ?? 1,
      };

      return { ok: true, medias, page: pageInfo };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findOne(id: number): Promise<GetMediaDetailDto> {
    try {
      const media = await this.mediaRepository.findOne({ where: { id } });
      if (!media) return { ok: false, error: MediaError.MediaNotExist };
      return { ok: true, media };
    } catch (error) {
      return { ok: false, error };
    }
  }

  // update(id: number, updateMediaDto: UpdateMediaDto) {
  //   return `This action updates a #${id} media`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} media`;
  // }
}
