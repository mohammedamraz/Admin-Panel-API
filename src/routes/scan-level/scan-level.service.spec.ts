import { Test, TestingModule } from '@nestjs/testing';
import { ScanLevelService } from './scan-level.service';

describe('ScanLevelService', () => {
  let service: ScanLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanLevelService],
    }).compile();

    service = module.get<ScanLevelService>(ScanLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
