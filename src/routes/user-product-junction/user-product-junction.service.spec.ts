import { Test, TestingModule } from '@nestjs/testing';
import { UserProductJunctionService } from './user-product-junction.service';

describe('UserProductJunctionService', () => {
  let service: UserProductJunctionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProductJunctionService],
    }).compile();

    service = module.get<UserProductJunctionService>(UserProductJunctionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
