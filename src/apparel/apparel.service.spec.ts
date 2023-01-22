import { Test, TestingModule } from '@nestjs/testing';
import { ApparelService } from './apparel.service';

describe('ApparelService', () => {
  let service: ApparelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApparelService],
    }).compile();

    service = module.get<ApparelService>(ApparelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
