import { Test, TestingModule } from '@nestjs/testing';
import { VideoToVitalsController } from './video-to-vitals.controller';
import { VideoToVitalsService } from './video-to-vitals.service';

describe('VideoToVitalsController', () => {
  let controller: VideoToVitalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoToVitalsController],
      providers: [VideoToVitalsService],
    }).compile();

    controller = module.get<VideoToVitalsController>(VideoToVitalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
