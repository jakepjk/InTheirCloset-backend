import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { CloudflareOptions } from 'src/cloudflare/cloudflare.interface';
import { ResponseUploadImageDto } from 'src/cloudflare/response/response-upload-image.dto';
import { InUploadImageByUrlDto } from 'src/cloudflare/dto/cloudflare.dto';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import {
  ResponseDeleteUrlDto,
  ResponseGetUploadUrlDto,
} from 'src/cloudflare/response/response-get-upload-url.dto';

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
      data: `-----011000010111000001101001\r\nContent-Disposition: form-data; name="url"\r\n\r\n${uploadImageByUrlDto.imageUrl}\r\n-----011000010111000001101001--\r\n\r\n`,
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

  async deleteImage(imageId: string): Promise<ResponseDeleteUrlDto> {
    const options = {
      method: 'DELETE',
      url: `https://api.cloudflare.com/client/v4/accounts/${this.options.accountId}/images/v1/${imageId}`,
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

  isCloudflareImage(imageUrl: string): boolean {
    return imageUrl.startsWith(process.env.CLOUDFLARE_IMAGE_DELIVERY_URL);
  }

  getCloudflareUrl(imageId: string): string {
    return process.env.CLOUDFLARE_IMAGE_DELIVERY_URL + '/' + imageId;
  }
}
