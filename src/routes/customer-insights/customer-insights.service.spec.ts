import { Test, TestingModule } from '@nestjs/testing';
import { CustomerInsightsService } from './customer-insights.service';

describe('CustomerInsightsService', () => {
  let service: CustomerInsightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerInsightsService],
    }).compile();

    service = module.get<CustomerInsightsService>(CustomerInsightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
