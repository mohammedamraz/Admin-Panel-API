import { Test, TestingModule } from '@nestjs/testing';
import { GenericUrlController } from './generic-url.controller';
import { GenericUrlService } from './generic-url.service';
// import { ProductController } from './product.controller';
// import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: GenericUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenericUrlController],
      providers: [GenericUrlService],
    }).compile();

    controller = module.get<GenericUrlController>(GenericUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
