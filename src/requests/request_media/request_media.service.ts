import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
import { DEFAULT_LIMIT } from 'src/common/common.constants';
import { CommonDto } from 'src/common/dto/common.dto';
import { getPageInfo, PageError } from 'src/common/dto/page.dto';
import { Media } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';
import { RequestStatus, RequestType } from 'src/requests/request.enum';
import { GetRequestMediaDto } from 'src/requests/request_media/dto/get-request_media.dto';
import { ProcessRequestBodyMediaDto } from 'src/requests/request_media/dto/proess-request_media.dto';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { CreateRequestMediaDto } from './dto/create-request_media.dto';
import { UpdateRequestMediaDto } from './dto/update-request_media.dto';

enum RequestMediaError {
  RequestMediaNotExist = '미디어 요청 정보가 없습니다.',
  Duplicate = '해당 미디어가 이미 존재합니다.',
  ProcessNotAllowed = '승인 또는 거절만 가능합니다.',
  MediaNotExist = '미디어 정보가 없습니다.',
  CommentRequired = '코멘트가 필요합니다.',
  DeleteRequestCannotUpdate = '삭제 요청은 수정할 수 없습니다.',
  NoAuthentication = '권한이 없습니다.',
  CannotChangeFinshedRequest = '완료된 요청은 변경할 수 없습니다.',
}

@Injectable()
export class RequestMediaService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly cloudflareService: CloudflareService,
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
       * type이 update이면 바꾸려는 title, subtitle이 media에 존재하는지 확인
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
        if (await this.mediaService.isDuplicated(media?.title, media?.subtitle))
          return { ok: false, error: RequestMediaError.Duplicate };

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

      // type이 update이면 바꾸려는 title, subtitle이 media에 존재하는지 확인
      if (requestMedia.requestType == RequestType.Update) {
        if (
          await this.mediaService.isDuplicated(
            requestMedia?.title,
            requestMedia?.subtitle,
          )
        )
          return { ok: false, error: RequestMediaError.Duplicate };
      }

      // type에 따라 media 업데이트 or 삭제
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
              id: userId,
            },
            status: status,
            requestType: type,
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

  async updateRequestMedia(
    user: User,
    processRequestMediaDto: ProcessRequestBodyMediaDto,
  ): Promise<CommonDto> {
    try {
      /**
       * requestMedia 가져오기 (없으면 에러)
       * user Role이 Manager이고 requestMedia의 requester (아니면 에러)
       * requestMedia의 status가 proceeding이나 stash (아니면 에러)
       * type이 delete이면 수정 불가능 (=에러)
       * title 중복 확인 (중복되면 에러)
       * 이미지가 수정되면 cloudflare에 이미지 추가
       * requestMedia 업데이트
       *
       */
      const updateRequest = processRequestMediaDto.requestMedia;

      // requestMedia 가져오기 (없으면 에러)
      const requestMedia = await this.requestMediaRepository.findOne({
        where: {
          id: updateRequest.id,
        },
      });
      if (!requestMedia)
        return { ok: false, error: RequestMediaError.RequestMediaNotExist };

      // user Role이 Manager이고 requestMedia의 requester가 아니면 에러
      if (
        user.role === UserRole.Manager &&
        requestMedia.requester.id !== user.id
      )
        return { ok: false, error: RequestMediaError.NoAuthentication };

      // requestMedia의 status가 proceeding이거나 stash (아니면 에러)
      if (
        requestMedia.status !== RequestStatus.Proceeding &&
        requestMedia.status !== RequestStatus.Stashed
      )
        return {
          ok: false,
          error: RequestMediaError.CannotChangeFinshedRequest,
        };

      // updateRequest의 status가 없으면 requestMedia status를 따라감
      updateRequest.status = updateRequest.status ?? requestMedia.status;

      // type이 delete이면 수정 불가능 (=에러)
      if (requestMedia.requestType === RequestType.Delete) {
        return {
          ok: false,
          error: RequestMediaError.DeleteRequestCannotUpdate,
        };
      }

      // title 중복 확인 (중복되면 에러)
      if (updateRequest.status !== RequestStatus.Stashed)
        if (
          await this.mediaService.isDuplicated(
            updateRequest.title,
            updateRequest.subtitle,
          )
        )
          return { ok: false, error: RequestMediaError.Duplicate };

      // 이미지가 수정되면 cloudflare에 이미치 추가
      if (
        updateRequest.image &&
        !updateRequest.image.startsWith(
          process.env.CLOUDFLARE_IMAGE_DELIVERY_URL,
        )
      ) {
        const { result, success, errors } =
          await this.cloudflareService.uploadImageByUrl({
            imageUrl: updateRequest.image,
          });

        if (!success) return { ok: false, error: errors.join('\n') };
        updateRequest.image =
          process.env.CLOUDFLARE_IMAGE_DELIVERY_URL + '/' + result.id;
      }

      await this.requestMediaRepository.save({
        ...requestMedia,
        status: updateRequest.status,
        type: updateRequest.type,
        title: updateRequest.title,
        subtitle: updateRequest.subtitle,
        image: updateRequest.image,
        genre: updateRequest.genre,
        season: updateRequest.season,
        episodesNumber: updateRequest.episodesNumber,
      });

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async removeRequestMedia(
    user: User,
    processRequestMediaDto: ProcessRequestBodyMediaDto,
  ): Promise<CommonDto> {
    try {
      /**
       * requestMedia 가져오기 (없으면 에러)
       * user Role이 Manager이고 requestMedia의 requester가 아니면 에러
       * 해당 requestMeida 삭제
       */

      // requestMedia 가져오기 (없으면 에러)
      const requestMedia = await this.requestMediaRepository.findOne({
        where: {
          id: processRequestMediaDto.requestMedia.id,
        },
      });
      if (!requestMedia)
        return { ok: false, error: RequestMediaError.RequestMediaNotExist };

      // user Role이 Manager이고 requestMedia의 requester가 아니면 에러
      if (
        user.role === UserRole.Manager &&
        requestMedia.requester.id !== user.id
      )
        return { ok: false, error: RequestMediaError.NoAuthentication };

      // 해당 requestMedia 삭제
      await this.requestMediaRepository.delete({ id: requestMedia.id });

      return { ok: true };
    } catch (error) {
      console.log(error);

      return { ok: false, error };
    }
  }
}
