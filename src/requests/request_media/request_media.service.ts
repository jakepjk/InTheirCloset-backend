import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_LIMIT } from 'src/common/common.constants';
import { CommonDto } from 'src/common/dto/common.dto';
import { getPageInfo, PageError } from 'src/common/dto/page.dto';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { RequestStatus, RequestType } from 'src/requests/request.enum';
import { GetRequestMediaDto } from 'src/requests/request_media/dto/get-request_media.dto';
import { ProcessRequestBodyMediaDto } from 'src/requests/request_media/dto/proess-request_media.dto';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { CreateRequestMediaDto } from './dto/create-request_media.dto';
import { UpdateRequestMediaDto } from './dto/update-request_media.dto';

enum RequestMediaError {
  RequestMediaNotExist = '미디어 요청 정보가 없습니다.',
  Duplicate = '해당 미디어가 이미 존재합니다.',
  ProcessNotAllowed = '승인 또는 거절만 가능합니다.',
  MediaNotExist = '미디어 정보가 없습니다.',
  CommentRequired = '코멘트가 필요합니다.',
}

@Injectable()
export class RequestMediaService {
  constructor(
    private readonly mediaService: MediaService,
    @InjectRepository(RequestMedia)
    private readonly requestMediaRepository: Repository<RequestMedia>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async approveRequestMedia(
    processRequestMediaDto: ProcessRequestBodyMediaDto,
  ): Promise<CommonDto> {
    try {
      /**
       * requestMedia 가져오기 (없으면 에러)
       * 가져온 requestMedia가 가르키는 Media 가져오기
       * type이 create이면 해당 Media가 중복되는 지 확인 후 media 저장
       * type이 create가 아니면 해당 Media 존재하는지 확인
       * type에 따라 media 업데이트 or 삭제
       * requestMedia 업데이트
       */

      // requestMedia 가져오기 (없으면 에러)
      const requestMedia = await this.requestMediaRepository.findOne({
        where: {
          id: processRequestMediaDto.requestMedia.id,
          status: RequestStatus.Proceeding,
        },
      });
      if (!requestMedia)
        return { ok: false, error: RequestMediaError.RequestMediaNotExist };

      // 가져온 requestMedia가 가르키는 Media 가져오기
      const media = requestMedia.media;

      // type이 create이면 해당 Media가 중복되는 지 확인 후 저장
      if (requestMedia.requestType == RequestType.Create) {
        const duplicate = await this.mediaService.findOneByTitle(
          media?.title,
          media?.subtitle,
        );
        if (duplicate) return { ok: false, error: RequestMediaError.Duplicate };

        const afterMedia = await this.mediaRepository.save(
          this.mediaRepository.create({
            title: requestMedia.title,
            subtitle: requestMedia.subtitle,
            image: requestMedia.image,
            genre: requestMedia.genre,
            season: requestMedia.season,
            type: requestMedia.type,
            episodesNumber: requestMedia.episodesNumber,
          }),
        );
        // requestMedia 업데이트
        requestMedia.status = RequestStatus.Approved;
        requestMedia.comment = processRequestMediaDto.requestMedia.comment;

        await this.requestMediaRepository.save({
          ...requestMedia,
          media: afterMedia,
        });
        return { ok: true };
      }

      // type이 create가 아니면 해당 Media 존재하는지 확인
      if (!media) return { ok: false, error: RequestMediaError.MediaNotExist };

      // type에 따라 media 업데이트 or 삭제
      console.log({
        ...media,
        title: requestMedia.title ?? media.title,
        subtitle: requestMedia.subtitle ?? media.subtitle,
        image: requestMedia.image ?? media.image,
        genre: requestMedia.genre ?? media.genre,
        season: requestMedia.season ?? media.season,
        type: requestMedia.type ?? media.type,
        episodesNumber: requestMedia.episodesNumber ?? media.episodesNumber,
      });

      let afterMedia: Media | null;
      if (requestMedia.requestType == RequestType.Update) {
        afterMedia = await this.mediaRepository.save({
          ...media,
          title: requestMedia.title ?? media.title,
          subtitle: requestMedia.subtitle ?? media.subtitle,
          image: requestMedia.image ?? media.image,
          genre: requestMedia.genre ?? media.genre,
          season: requestMedia.season ?? media.season,
          type: requestMedia.type ?? media.type,
          episodesNumber: requestMedia.episodesNumber ?? media.episodesNumber,
        });
      } else {
        await this.mediaRepository.delete({ id: media.id });
        afterMedia = null;
      }

      requestMedia.status = RequestStatus.Approved;
      requestMedia.comment = processRequestMediaDto.requestMedia.comment;

      await this.requestMediaRepository.save({
        ...requestMedia,
        media: afterMedia,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async rejectRequestMedia(
    processRequestMediaDto: ProcessRequestBodyMediaDto,
  ): Promise<CommonDto> {
    try {
      /**
       * comment 없으면 에러
       * requestMedia 가져오기 (없으면 에러)
       * requestMedia 업데이트
       */

      // comment 없으면 에러
      if (!processRequestMediaDto.requestMedia.comment)
        return { ok: false, error: RequestMediaError.CommentRequired };

      // requestMedia 가져오기 (없으면 에러)
      const requestMedia = await this.requestMediaRepository.findOne({
        where: {
          id: processRequestMediaDto.requestMedia.id,
          status: RequestStatus.Proceeding,
        },
      });
      if (!requestMedia)
        return { ok: false, error: RequestMediaError.RequestMediaNotExist };

      // requestMedia 업데이트
      requestMedia.status = RequestStatus.Rejected;
      requestMedia.comment = processRequestMediaDto.requestMedia.comment;
      await this.requestMediaRepository.save(requestMedia);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findAll(
    userId?: number,
    status?: RequestStatus,
    type?: RequestType,
    limit?: number,
    page?: number,
  ): Promise<GetRequestMediaDto> {
    if (limit < 1)
      return { ok: false, error: PageError.LimitMustBeNaturalNumber };

    try {
      const [requestMedia, count] =
        await this.requestMediaRepository.findAndCount({
          where: {
            requester: {
              id: userId ?? MoreThan(0),
            },
            status: status ?? In(Object.values(RequestStatus)),
            requestType: type ?? In(Object.values(RequestType)),
          },
          skip: (limit ?? DEFAULT_LIMIT) * ((page ?? 1) - 1),
          take: limit,
          order: { updatedAt: 'DESC' },
        });
      return { ok: true, requestMedia, page: getPageInfo(count, limit, page) };
    } catch (error) {
      return { ok: false, error };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} requestMedia`;
  }

  update(id: number, updateRequestMediaDto: UpdateRequestMediaDto) {
    return `This action updates a #${id} requestMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestMedia`;
  }
}
