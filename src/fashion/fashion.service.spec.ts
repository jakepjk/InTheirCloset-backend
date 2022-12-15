import { Test, TestingModule } from '@nestjs/testing';
import { FashionService } from './fashion.service';

describe('FashionService', () => {
  let service: FashionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FashionService],
    }).compile();

    service = module.get<FashionService>(FashionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
