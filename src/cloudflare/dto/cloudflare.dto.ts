import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InUploadImageByUrlDto {
  @IsString()
  @ApiProperty()
  imageURL: string;
}
