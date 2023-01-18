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
import { RequestMediaService } from './request_media.service';
import { CreateRequestMediaDto } from './dto/create-request_media.dto';
import { UpdateRequestMediaDto } from './dto/update-request_media.dto';
import { RequestStatus, RequestType } from 'src/requests/request.enum';
import { GetRequestMediaDto } from 'src/requests/request_media/dto/get-request_media.dto';
import { ProcessRequestBodyMediaDto } from 'src/requests/request_media/dto/proess-request_media.dto';
import { CommonDto } from 'src/common/dto/common.dto';
import { Role } from 'src/auth/role/role.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('request/media')
export class RequestMediaController {
  constructor(private readonly requestMediaService: RequestMediaService) {}

  @Post('approved')
  @Role([UserRole.Admin])
  approveRequestMedia(
    @Body() processRequestMediaDto: ProcessRequestBodyMediaDto,
  ): Promise<CommonDto> {
    return this.requestMediaService.approveRequestMedia(processRequestMediaDto);
  }

  @Post('rejected')
  @Role([UserRole.Admin])
  rejectRequestMedia(
    @Body() processRequestMediaDto: ProcessRequestBodyMediaDto,
  ): Promise<CommonDto> {
    return this.requestMediaService.rejectRequestMedia(processRequestMediaDto);
  }

  // @Get()
  // findAll() {
  //   return this.requestMediaService.findAll();
  // }

  @Role([UserRole.Admin, UserRole.Manager])
  @Get()
  findOne(
    @Query('user') userId?: number,
    @Query('status') status?: RequestStatus,
    @Query('type') type?: RequestType,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GetRequestMediaDto> {
    return this.requestMediaService.findAll(userId, status, type, limit, page);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRequestMediaDto: UpdateRequestMediaDto,
  // ) {
  //   return this.requestMediaService.update(+id, updateRequestMediaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.requestMediaService.remove(+id);
  // }
}
