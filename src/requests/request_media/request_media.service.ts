import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_LIMIT } from 'src/common/common.constants';
import { getPageInfo, PageError } from 'src/common/dto/page.dto';
import { RequestStatus, RequestType } from 'src/requests/request.enum';
import { GetRequestMediaDto } from 'src/requests/request_media/dto/get-request_media.dto';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { CreateRequestMediaDto } from './dto/create-request_media.dto';
import { UpdateRequestMediaDto } from './dto/update-request_media.dto';

@Injectable()
export class RequestMediaService {
  constructor(
    @InjectRepository(RequestMedia)
    private readonly requestMediaRepository: Repository<RequestMedia>,
  ) {}
  create(createRequestMediaDto: CreateRequestMediaDto) {
    return 'This action adds a new requestMedia';
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
