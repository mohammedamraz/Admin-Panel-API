import { Test, TestingModule } from '@nestjs/testing';
import { UserProductJunctionController } from './user-product-junction.controller';
import { UserProductJunctionService } from './user-product-junction.service';

describe('UserProductJunctionController', () => {
  let controller: UserProductJunctionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProductJunctionController],
      providers: [UserProductJunctionService],
    }).compile();

    controller = module.get<UserProductJunctionController>(UserProductJunctionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
