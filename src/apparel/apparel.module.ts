import { Module } from '@nestjs/common';
import { ApparelService } from './apparel.service';
import { ApparelController } from './apparel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apparel } from 'src/apparel/entities/apparel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apparel])],
  controllers: [ApparelController],
  providers: [ApparelService],
})
export class ApparelModule {}
