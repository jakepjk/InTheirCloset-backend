import { PartialType } from '@nestjs/swagger';
import { CreateFashionDto } from './create-fashion.dto';

export class UpdateFashionDto extends PartialType(CreateFashionDto) {}
