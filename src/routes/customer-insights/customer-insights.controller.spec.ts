import { Test, TestingModule } from '@nestjs/testing';
import { CustomerInsightsController } from './customer-insights.controller';

describe('CustomerInsightsController', () => {
  let controller: CustomerInsightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerInsightsController],
    }).compile();

    controller = module.get<CustomerInsightsController>(CustomerInsightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
