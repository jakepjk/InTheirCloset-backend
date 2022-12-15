import { Test, TestingModule } from '@nestjs/testing';
import { FashionController } from './fashion.controller';
import { FashionService } from './fashion.service';

describe('FashionController', () => {
  let controller: FashionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FashionController],
      providers: [FashionService],
    }).compile();

    controller = module.get<FashionController>(FashionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
