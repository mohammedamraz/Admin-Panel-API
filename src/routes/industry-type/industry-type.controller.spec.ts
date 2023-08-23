import { Test, TestingModule } from '@nestjs/testing';
import { IndustryTypeController } from './industry-type.controller';

describe('IndustryTypeController', () => {
  let controller: IndustryTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndustryTypeController],
    }).compile();

    controller = module.get<IndustryTypeController>(IndustryTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
