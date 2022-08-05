import { Module } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { VideoToVitalsController } from './video-to-vitals.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'video_to_vitals'}),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
  ],
  controllers: [VideoToVitalsController],
  providers: [VideoToVitalsService]
})
export class VideoToVitalsModule {}
