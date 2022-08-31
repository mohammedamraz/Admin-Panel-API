import { Test, TestingModule } from '@nestjs/testing';
import { ProfileInfoController } from './profile-info.controller';

describe('ProfileInfoController', () => {
  let controller: ProfileInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileInfoController],
    }).compile();

    controller = module.get<ProfileInfoController>(ProfileInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
