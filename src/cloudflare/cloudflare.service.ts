import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { CloudflareOptions } from 'src/cloudflare/cloudflare.interface';
import { ResponseUploadImageDto } from 'src/cloudflare/response/response-upload-image.dto';
import { InUploadImageByUrlDto } from 'src/cloudflare/dto/cloudflare.dto';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { ResponseGetUploadUrlDto } from 'src/cloudflare/response/response-get-upload-url.dto';

@Injectable()
export class CloudflareService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: CloudflareOptions,
    private readonly httpService: HttpService,
  ) {}

  async uploadImageByUrl(
    uploadImageByUrlDto: InUploadImageByUrlDto,
  ): Promise<ResponseUploadImageDto> {
    const options = {
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/accounts/${this.options.accountId}/images/v1`,
      headers: {
        'Content-Type':
          'multipart/form-data; boundary=---011000010111000001101001',
        Authorization: `Bearer ${this.options.apiToken}`,
      },
      data: `-----011000010111000001101001\r\nContent-Disposition: form-data; name="url"\r\n\r\n${uploadImageByUrlDto.imageURL}\r\n-----011000010111000001101001--\r\n\r\n`,
    };

    try {
      const result = await this.httpService.axiosRef.request(options);
      return await result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUploadUrl(): Promise<ResponseGetUploadUrlDto> {
    const options = {
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/accounts/${this.options.accountId}/images/v2/direct_upload`,
      headers: {
        Authorization: `Bearer ${this.options.apiToken}`,
      },
    };

    try {
      const result = await this.httpService.axiosRef.request(options);
      return await result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
