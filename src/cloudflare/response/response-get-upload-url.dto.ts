import { ApiProperty } from '@nestjs/swagger';

class ResultGetUploadUrl {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uploadURL: string;
}

export class ResponseGetUploadUrlDto {
  @ApiProperty({ type: () => ResultGetUploadUrl })
  result: ResultGetUploadUrl;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  errors: string[];

  @ApiProperty()
  messages: string[];
}

export class ResponseDeleteUrlDto {
  result: ResultGetUploadUrl;

  result_info: string;

  success: boolean;

  errors: string[];

  messages: string[];
}
