import { Module } from '@nestjs/common';
import { FashionService } from './fashion.service';
import { FashionController } from './fashion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fashion } from 'src/fashion/entities/fashion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fashion])],
  controllers: [FashionController],
  providers: [FashionService],
})
export class FashionModule {}
