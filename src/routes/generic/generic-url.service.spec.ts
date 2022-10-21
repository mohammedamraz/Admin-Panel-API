import { Test, TestingModule } from '@nestjs/testing';
import { GenericUrlService } from './generic-url.service';
// import { ProductService } from './product.service';

describe('GenericUrlService', () => {
  let service: GenericUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericUrlService],
    }).compile();

    service = module.get<GenericUrlService>(GenericUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
