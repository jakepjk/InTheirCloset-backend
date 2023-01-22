import { Test, TestingModule } from '@nestjs/testing';
import { ApparelController } from './apparel.controller';
import { ApparelService } from './apparel.service';

describe('ApparelController', () => {
  let controller: ApparelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApparelController],
      providers: [ApparelService],
    }).compile();

    controller = module.get<ApparelController>(ApparelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
