import { ApiProperty } from '@nestjs/swagger';

interface MetaData {
  [key: string]: string;
}

class ResultUploadImage {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  metadata: MetaData;

  @ApiProperty()
  uploaded: string;

  @ApiProperty()
  requireSignedURLs: boolean;

  @ApiProperty()
  variants: string[];
}

export class ResponseUploadImageDto {
  @ApiProperty({ type: () => ResultUploadImage })
  result: ResultUploadImage;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  errors: string[];

  @ApiProperty()
  messages: string[];
}
