import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetApparelDetailDto,
  GetApparelsDto,
} from 'src/apparel/dto/get-apparel.dto';
import {
  RequestApparelBodyDto,
  RequestApparelDto,
} from 'src/apparel/dto/request-apparel.dto';
import { Apparel } from 'src/apparel/entities/apparel.entity';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
import { DEFAULT_LIMIT } from 'src/common/common.constants';
import { getPageInfo, PageError } from 'src/common/dto/page.dto';
import { User } from 'src/users/entities/user.entity';
import { ArrayContains, Like, Repository } from 'typeorm';
import { CreateApparelDto } from './dto/create-apparel.dto';
import { UpdateApparelDto } from './dto/update-apparel.dto';

enum ApparelError {
  ApparelNotExist = '옷 정보가 없습니다.',
  Duplicate = '해당 옷이 이미 존재합니다.',
}

@Injectable()
export class ApparelService {
  constructor(
    private readonly cloudflareService: CloudflareService,
    @InjectRepository(Apparel)
    private readonly apparelRepository: Repository<Apparel>,
  ) {}

  async isDuplicated(code: string, manufacturer: string): Promise<boolean> {
    const duplicate = await this.apparelRepository.findOne({
      where: {
        code,
        manufacturer,
      },
    });
    if (duplicate) return true;
    return false;
  }

  async findAll(
    search?: string,
    limit?: number,
    page?: number,
  ): Promise<GetApparelsDto> {
    search = search ?? '';
    if (limit < 1)
      return { ok: false, error: PageError.LimitMustBeNaturalNumber };
    try {
      const [apparels, count] = await this.apparelRepository.findAndCount({
        select: ['id', 'name', 'manufacturer', 'views'],
        where: [
          { categories: ArrayContains([search]) },
          { name: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
          { manufacturer: Like(`%${search}%`) },
          { material: ArrayContains([search]) },
          { color: ArrayContains([search]) },
          { origin: Like(`%${search}%`) },
        ],
        skip: (limit ?? DEFAULT_LIMIT) * ((page ?? 1) - 1),
        take: limit,
        order: { updatedAt: 'DESC' },
      });

      return { ok: true, apparels, page: getPageInfo(count, limit, page) };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findOne(id: number): Promise<GetApparelDetailDto> {
    try {
      const media = await this.apparelRepository.findOne({ where: { id } });
      if (!media) return { ok: false, error: ApparelError.ApparelNotExist };
      return { ok: true, media };
    } catch (error) {
      return { ok: false, error };
    }
  }

  // TODO
  async createRequest(
    stash: boolean,
    user: User,
    requestApparelBodyDto: RequestApparelBodyDto,
  ): Promise<RequestApparelDto> {
    const apparel = requestApparelBodyDto.apparel;
    try {
      if (!stash) {
        if (await this.isDuplicated(apparel.code, apparel.manufacturer))
          return { ok: false, error: ApparelError.Duplicate };
      }

      // image가 cloudflare가 아니면 cloudflare에 저장 후 사용
      if (
        !this.cloudflareService.isCloudflareImage(apparel.representativeImage)
      ) {
        const { success, result, errors } =
          await this.cloudflareService.uploadImageByUrl({
            imageUrl: apparel.representativeImage,
          });
        if (success)
          apparel.representativeImage = this.cloudflareService.getCloudflareUrl(
            result.id,
          );
        else return { ok: false, error: errors.join('\n') };
      }

      // TODO: 중복이 없으면 request 테이블에 저장

      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.toString() };
    }
  }

  update(id: number, updateApparelDto: UpdateApparelDto) {
    return `This action updates a #${id} apparel`;
  }

  remove(id: number) {
    return `This action removes a #${id} apparel`;
  }
}
