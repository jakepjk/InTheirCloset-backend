import { Body, Controller, Get, Post } from '@nestjs/common';
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
  uploadImageByFile() {
    return this.cloudflareService.getUploadUrl();
  }
}
