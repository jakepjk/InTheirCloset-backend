import { PartialType } from '@nestjs/swagger';
import { CreateRequestMediaDto } from './create-request_media.dto';

export class UpdateRequestMediaDto extends PartialType(CreateRequestMediaDto) {}
