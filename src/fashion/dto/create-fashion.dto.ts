import { OmitType } from '@nestjs/mapped-types';
import { Fashion } from 'src/fashion/entities/fashion.entity';

export class CreateFashionDto extends OmitType(Fashion, [
  'id',
  'createdAt',
  'updatedAt',
  'representativeImage',
  'images',
]) {}

export class CreateFashionWithURLDto extends CreateFashionDto {
  representativeImageURL: string;
  imagesURL: string[];
}
