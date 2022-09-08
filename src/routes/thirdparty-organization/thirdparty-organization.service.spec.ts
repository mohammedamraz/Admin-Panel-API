import { Test, TestingModule } from '@nestjs/testing';
import { ThirdpartyOrganizationService } from './thirdparty-organization.service';

describe('ThirdpartyOrganizationService', () => {
  let service: ThirdpartyOrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThirdpartyOrganizationService],
    }).compile();

    service = module.get<ThirdpartyOrganizationService>(ThirdpartyOrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
