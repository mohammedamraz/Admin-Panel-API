import { Test, TestingModule } from '@nestjs/testing';
import { VideoToVitalsService } from './video-to-vitals.service';

describe('VideoToVitalsService', () => {
  let service: VideoToVitalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoToVitalsService],
    }).compile();

    service = module.get<VideoToVitalsService>(VideoToVitalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
