import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role/role.decorator';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
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

interface Titles {
  title?: string;
  subtitle?: string;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(RequestMedia)
    private readonly requestMediaRepository: Repository<RequestMedia>,
    private readonly cloudflareService: CloudflareService,
  ) {}

  // util
  // async findOneByTitle(titles: Titles): Promise<Media | null> {
  //   if (!titles.title) return null;
  //   const media = await this.mediaRepository.findOne({
  //     where: titles,
  //   });
  //   return media;
  // }

  async isDuplicated(title: string, subtitle: string): Promise<boolean> {
    if (title === undefined) return false;
    const duplicate = await this.mediaRepository.findOne({
      where: {
        title: title,
        subtitle: subtitle,
      },
    });
    if (duplicate) return true;
    return false;
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

  async createRequest(
    stash: boolean,
    user: User,
    requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    const media = requestMediaBodyDto.media;
    try {
      if (!stash) {
        // media 중복 찾고 있으면 에러
        if (await this.isDuplicated(media.title, media.subtitle))
          return { ok: false, error: MediaError.Duplicate };
      }

      // image가 cloudflare가 아니면 cloudflare에 저장 후 사용
      if (
        !requestMediaBodyDto.media.image.startsWith(
          process.env.CLOUDFLARE_IMAGE_DELIVERY_URL,
        )
      ) {
        const { success, result, errors } =
          await this.cloudflareService.uploadImageByUrl({
            imageUrl: requestMediaBodyDto.media.image,
          });
        if (success)
          requestMediaBodyDto.media.image =
            process.env.CLOUDFLARE_IMAGE_DELIVERY_URL + '/' + result.id;
        else return { ok: false, error: errors.join('\n') };
      }

      // 중복이 없으면 request 테이블에 저장
      await this.requestMediaRepository.save(
        this.requestMediaRepository.create({
          requestType: RequestType.Create,
          requester: user,
          status: stash ? RequestStatus.Stashed : RequestStatus.Proceeding,
          ...media,
        }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
  async updateRequest(
    stash: boolean,
    user: User,
    requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    // 바꾸려는 속성 정의
    const media = requestMediaBodyDto.media;
    try {
      // 바꾸려는 media 가져오기
      const beforeMedia = await this.mediaRepository.findOne({
        where: {
          id: media.id,
        },
      });
      if (!beforeMedia) return { ok: false, error: MediaError.MediaNotExist };

      if (!stash) {
        // title이 겹치는 것이 있는지 확인 후 있으면 에러
        if (await this.isDuplicated(media.title, media.subtitle))
          return { ok: false, error: MediaError.Duplicate };
      }

      // image가 입력되면 cloudflare에 이미지 업로드 필요
      // image가 존재하고 cloudflare가 아니면 cloudflare에 저장 후 사용
      if (
        media.image &&
        !media.image.startsWith(process.env.CLOUDFLARE_IMAGE_DELIVERY_URL)
      ) {
        const { success, result, errors } =
          await this.cloudflareService.uploadImageByUrl({
            imageUrl: media.image,
          });
        if (success)
          media.image =
            process.env.CLOUDFLARE_IMAGE_DELIVERY_URL + '/' + result.id;
        else return { ok: false, error: errors.join('\n') };
      }

      // create media update request
      await this.requestMediaRepository.save(
        this.requestMediaRepository.create({
          requestType: RequestType.Update,
          requester: user,
          status: RequestStatus.Proceeding,
          media: beforeMedia,
          type: media.type,
          title: media.title,
          subtitle: media.subtitle,
          image: media.image,
          genre: media.genre,
          season: media.season,
          episodesNumber: media.episodesNumber,
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
