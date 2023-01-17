import { Test, TestingModule } from '@nestjs/testing';
import { RequestMediaController } from './request_media.controller';
import { RequestMediaService } from './request_media.service';

describe('RequestMediaController', () => {
  let controller: RequestMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestMediaController],
      providers: [RequestMediaService],
    }).compile();

    controller = module.get<RequestMediaController>(RequestMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
