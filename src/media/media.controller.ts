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
import { GetMediaDetailDto, GetMediasDto } from 'src/media/dto/get-media.dto';
import {
  RequestCreateMediaBodyDto,
  RequestCreateMediaDto,
} from 'src/media/dto/request-media.dto';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Role([UserRole.Admin, UserRole.Manager])
  @Post()
  create(
    @AuthUser() user: User,
    @Body() requestCreateMediaBodyDto: RequestCreateMediaBodyDto,
  ): Promise<RequestCreateMediaDto> {
    return this.mediaService.createRequest(user, requestCreateMediaBodyDto);
  }

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
  //   return this.mediaService.update(+id, updateMediaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.mediaService.remove(+id);
  // }
}
