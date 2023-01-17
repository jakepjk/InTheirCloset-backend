import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from 'src/media/entities/media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMedia } from 'src/requests/request_media/entities/request_media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, RequestMedia])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
