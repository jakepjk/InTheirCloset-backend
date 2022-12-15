import { Module } from '@nestjs/common';
import { FashionService } from './fashion.service';
import { FashionController } from './fashion.controller';

@Module({
  controllers: [FashionController],
  providers: [FashionService]
})
export class FashionModule {}
