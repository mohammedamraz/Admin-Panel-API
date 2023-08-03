import { Test, TestingModule } from '@nestjs/testing';
import { ScanLevelController } from './scan-level.controller';

describe('ScanLevelController', () => {
  let controller: ScanLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanLevelController],
    }).compile();

    controller = module.get<ScanLevelController>(ScanLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
