import { Module } from '@nestjs/common';
import { RequestMediaService } from './request_media.service';
import { RequestMediaController } from './request_media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestMedia])],
  controllers: [RequestMediaController],
  providers: [RequestMediaService],
})
export class RequestMediaModule {}
