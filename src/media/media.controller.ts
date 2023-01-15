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
import { GetMediaDetailDto, GetMediasDto } from 'src/media/dto/get-media';
import { MediaType } from 'src/media/entities/media.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // @Post()
  // create(@Body() createMediaDto: CreateMediaDto) {
  //   return this.mediaService.create(createMediaDto);
  // }

  @Get(':type')
  findAll(
    @Param('type') type: MediaType,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GetMediasDto> {
    return this.mediaService.findAll(type, search, limit, page);
  }

  @Get(':id')
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
