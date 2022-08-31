import { Test, TestingModule } from '@nestjs/testing';
import { OrgProductJunctionController } from './org-product-junction.controller';
import { OrgProductJunctionService } from './org-product-junction.service';

describe('OrgProductJunctionController', () => {
  let controller: OrgProductJunctionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgProductJunctionController],
      providers: [OrgProductJunctionService],
    }).compile();

    controller = module.get<OrgProductJunctionController>(OrgProductJunctionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
