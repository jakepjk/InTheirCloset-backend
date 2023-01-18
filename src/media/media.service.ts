import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role/role.decorator';
import { DEFAULT_LIMIT } from 'src/common/common.constants';
import { CommonDto } from 'src/common/dto/common.dto';
import { getPageInfo, PageDto, PageError } from 'src/common/dto/page.dto';
import { GetMediaDetailDto, GetMediasDto } from 'src/media/dto/get-media.dto';
import { RequestMediaBodyDto } from 'src/media/dto/request-media.dto';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { RequestStatus, RequestType } from 'src/requests/request.enum';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { And, Any, ArrayContains, In, Like, Repository } from 'typeorm';

enum MediaError {
  MediaNotExist = '미디어 정보가 없습니다.',
  Duplicate = '해당 미디어가 이미 존재합니다.',
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(RequestMedia)
    private readonly requestMediaRepository: Repository<RequestMedia>,
  ) {}

  async createRequest(
    user: User,
    requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    const media = requestMediaBodyDto.media;
    try {
      const duplicate = this.findOneByTitle(media.title, media.subtitle);
      if (duplicate) return { ok: false, error: MediaError.Duplicate };

      await this.requestMediaRepository.save(
        this.requestMediaRepository.create({
          requestType: RequestType.Create,
          requester: user,
          status: RequestStatus.Proceeding,
          ...media,
        }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

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
        select: ['id', 'title', 'image'],
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

      return { ok: true, medias, page: getPageInfo(count, limit, page) };
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

  async findOneByTitle(
    title?: string,
    subtitle?: string,
  ): Promise<Media | null> {
    const media = await this.mediaRepository.findOne({
      where: {
        title: title ?? null,
        subtitle: subtitle ?? null,
      },
    });
    return media;
  }

  async updateRequest(
    user: User,
    requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    const media = requestMediaBodyDto.media;
    try {
      console.log(media);

      const beforeMedia = await this.mediaRepository.findOne({
        where: {
          id: media.id,
        },
      });
      if (!beforeMedia) return { ok: false, error: MediaError.MediaNotExist };

      const duplicate = this.findOneByTitle(media?.title, media?.subtitle);
      if (duplicate) return { ok: false, error: MediaError.Duplicate };

      await this.requestMediaRepository.save(
        this.requestMediaRepository.create({
          requestType: RequestType.Update,
          requester: user,
          status: RequestStatus.Proceeding,
          media: beforeMedia,
          ...media,
        }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async removeRequest(
    user: User,
    requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    const media = requestMediaBodyDto.media;
    try {
      console.log(media);

      const beforeMedia = await this.mediaRepository.findOne({
        where: {
          id: media.id,
        },
      });
      if (!beforeMedia) return { ok: false, error: MediaError.MediaNotExist };

      await this.requestMediaRepository.save(
        this.requestMediaRepository.create({
          requestType: RequestType.Delete,
          requester: user,
          status: RequestStatus.Proceeding,
          media: beforeMedia,
        }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
