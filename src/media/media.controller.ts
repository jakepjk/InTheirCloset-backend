import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role/role.decorator';
import { CommonDto } from 'src/common/dto/common.dto';
import { GetMediaDetailDto, GetMediasDto } from 'src/media/dto/get-media.dto';
import { RequestMediaBodyDto } from 'src/media/dto/request-media.dto';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':type')
  findAll(
    @Param('type') type: MediaType,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GetMediasDto> {
    return this.mediaService.findAll(type, search, limit, page);
  }

  @Get('/detail/:id')
  findOne(@Param('id') id: string): Promise<GetMediaDetailDto> {
    return this.mediaService.findOne(+id);
  }

  @Role([UserRole.Admin, UserRole.Manager])
  @Post()
  createRequest(
    @Query('stash') stash: boolean,
    @AuthUser() user: User,
    @Body() requestCreateMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    return this.mediaService.createRequest(
      stash,
      user,
      requestCreateMediaBodyDto,
    );
  }

  @Role([UserRole.Admin, UserRole.Manager])
  @Patch()
  updateRequest(
    @Query('stash') stash: boolean,
    @AuthUser() user: User,
    @Body() requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    return this.mediaService.updateRequest(stash, user, requestMediaBodyDto);
  }

  @Role([UserRole.Admin, UserRole.Manager])
  @Delete()
  removeRequest(
    @AuthUser() user: User,
    @Body() requestMediaBodyDto: RequestMediaBodyDto,
  ): Promise<CommonDto> {
    return this.mediaService.removeRequest(user, requestMediaBodyDto);
  }
}
