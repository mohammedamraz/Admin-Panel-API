import { Test, TestingModule } from '@nestjs/testing';
import { IndividualUserController } from './individual-user.controller';
import { IndividualUserService } from './individual-user.service';

describe('IndividualUserController', () => {
  let controller: IndividualUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndividualUserController],
      providers: [IndividualUserService],
    }).compile();

    controller = module.get<IndividualUserController>(IndividualUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
