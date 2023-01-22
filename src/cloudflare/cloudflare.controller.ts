import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
import { ResponseUploadImageDto } from 'src/cloudflare/response/response-upload-image.dto';
import { InUploadImageByUrlDto } from 'src/cloudflare/dto/cloudflare.dto';

@ApiTags('Cloudflare')
@Controller('cloudflare')
export class CloudflareController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Post('/image/url')
  @ApiBody({ type: InUploadImageByUrlDto })
  @ApiResponse({ type: ResponseUploadImageDto })
  uploadImageByUrl(@Body() uploadImageByUrlDto: InUploadImageByUrlDto) {
    return this.cloudflareService.uploadImageByUrl(uploadImageByUrlDto);
  }

  @Get('/image/file')
  async uploadImageByFile() {
    return this.cloudflareService.getUploadUrl();
  }

  @Delete('/image/:imageId')
  async deleteImage(@Param('imageId') imageId: string) {
    return this.cloudflareService.deleteImage(imageId);
  }
}
