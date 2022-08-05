import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { CreateVideoToVitalDto } from './dto/create-video-to-vital.dto';

const APP= "VideoToVitalsController"
@Controller()
export class VideoToVitalsController {
  constructor(private readonly videoToVitalsService: VideoToVitalsService) {}

  @Post()
  createPilot(@Body() createVideoToVitalDto: CreateVideoToVitalDto) {
    Logger.debug(`createPilot() DTO:${JSON.stringify(createVideoToVitalDto,)}`, APP);
    
    return this.videoToVitalsService.createPilot(createVideoToVitalDto);
  }

  @Get()
  fetchAllPilot() {
    Logger.debug(`fetchAllPilot()`, APP);

    return this.videoToVitalsService.fetchAllPilot();
  }

  @Get(':id')
  fetchOnePilot(@Param('id',ParseIntPipe) id: number) {
    Logger.debug(`createPilot() id:${id} `, APP);

    return this.videoToVitalsService.fetchOnePilot(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVideoToVitalDto: UpdateVideoToVitalDto) {
  //   return this.videoToVitalsService.update(+id, updateVideoToVitalDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.videoToVitalsService.remove(+id);
  // }
}
