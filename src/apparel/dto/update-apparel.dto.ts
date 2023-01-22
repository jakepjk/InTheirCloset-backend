import { PartialType } from '@nestjs/swagger';
import { CreateApparelDto } from './create-apparel.dto';

export class UpdateApparelDto extends PartialType(CreateApparelDto) {}
