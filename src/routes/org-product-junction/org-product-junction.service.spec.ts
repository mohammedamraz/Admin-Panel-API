import { Test, TestingModule } from '@nestjs/testing';
import { OrgProductJunctionService } from './org-product-junction.service';

describe('OrgProductJunctionService', () => {
  let service: OrgProductJunctionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgProductJunctionService],
    }).compile();

    service = module.get<OrgProductJunctionService>(OrgProductJunctionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
