import { Test, TestingModule } from '@nestjs/testing';
import { ProductTestsService } from './product_tests.service';

describe('ProductTestsService', () => {
  let service: ProductTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductTestsService],
    }).compile();

    service = module.get<ProductTestsService>(ProductTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
