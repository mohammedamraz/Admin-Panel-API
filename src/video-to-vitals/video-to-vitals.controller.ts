import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { CreateVideoToVitalDto } from './dto/create-video-to-vital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { STATIC_IMAGES_PROFILE } from 'src/constants';
import { editFileName, imageFileFilter } from 'src/constants/helper';

const APP= "VideoToVitalsController"
@Controller()
export class VideoToVitalsController {
  constructor(private readonly videoToVitalsService: VideoToVitalsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      _destination: STATIC_IMAGES_PROFILE,
      get destination() {
        return this._destination;
      },
      set destination(value) {
        this._destination = value;
      },
      filename: editFileName
    }),
    fileFilter: imageFileFilter
  }))
  createPilot(@Body() createVideoToVitalDto: CreateVideoToVitalDto, @UploadedFile() file) {
    Logger.debug(`createPilot() createVideoToVitalDto:${JSON.stringify(createVideoToVitalDto)} file:${JSON.stringify(file)}`, APP);
    
    return this.videoToVitalsService.createPilot(createVideoToVitalDto,file?.filename);
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
