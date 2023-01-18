import { Module } from '@nestjs/common';
import { RequestMediaService } from './request_media.service';
import { RequestMediaController } from './request_media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';
import { Media } from 'src/media/entities/media.entity';
import { MediaModule } from 'src/media/media.module';
import { MediaService } from 'src/media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestMedia, Media]), MediaModule],
  controllers: [RequestMediaController],
  providers: [RequestMediaService],
})
export class RequestMediaModule {}
