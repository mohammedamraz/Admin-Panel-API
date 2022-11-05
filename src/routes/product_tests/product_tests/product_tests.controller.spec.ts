import { Test, TestingModule } from '@nestjs/testing';
import { ProductTestsController } from './product_tests.controller';

describe('ProductTestsController', () => {
  let controller: ProductTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTestsController],
    }).compile();

    controller = module.get<ProductTestsController>(ProductTestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
