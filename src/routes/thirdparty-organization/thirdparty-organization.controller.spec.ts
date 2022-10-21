import { Test, TestingModule } from '@nestjs/testing';
import { ThirdpartyOrganizationController } from './thirdparty-organization.controller';

describe('ThirdpartyOrganizationController', () => {
  let controller: ThirdpartyOrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdpartyOrganizationController],
    }).compile();

    controller = module.get<ThirdpartyOrganizationController>(ThirdpartyOrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
