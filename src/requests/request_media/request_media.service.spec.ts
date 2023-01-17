import { Test, TestingModule } from '@nestjs/testing';
import { RequestMediaService } from './request_media.service';

describe('RequestMediaService', () => {
  let service: RequestMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestMediaService],
    }).compile();

    service = module.get<RequestMediaService>(RequestMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
