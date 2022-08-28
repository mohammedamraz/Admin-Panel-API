import { Test, TestingModule } from '@nestjs/testing';
import { IndividualUserService } from './individual-user.service';

describe('IndividualUserService', () => {
  let service: IndividualUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndividualUserService],
    }).compile();

    service = module.get<IndividualUserService>(IndividualUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
