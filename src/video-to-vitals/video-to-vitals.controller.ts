import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { AddUserDTO, CreateVideoToVitalDto } from './dto/create-video-to-vital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { STATIC_IMAGES, STATIC_IMAGES_PROFILE } from 'src/constants';
import { editFileName, imageFileFilter } from 'src/constants/helper';

const APP= "VideoToVitalsController"
@Controller()
export class VideoToVitalsController {
  constructor(private readonly videoToVitalsService: VideoToVitalsService) {}

  @Post('pilot')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      _destination: STATIC_IMAGES,
      // get destination() {
      //   console.log("DESTINATION",this._destination )
      //   return this._destination;
      // },
      // set destination(value) {
      //   console.log("value",value)
      //   this._destination = value;
      // },
      filename: editFileName
    }),
    fileFilter: imageFileFilter
  }))
  createPilot(@Body() createVideoToVitalDto: CreateVideoToVitalDto, @UploadedFile() file) {
    Logger.debug(`createPilot() createVideoToVitalDto:${JSON.stringify(createVideoToVitalDto)} file:${JSON.stringify(file)}`, APP);
    
    return this.videoToVitalsService.createPilot(createVideoToVitalDto,file?.path);
  }

  @Post('users')
  addUser(@Body() addUserDTO:AddUserDTO ){
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

   return this.videoToVitalsService.addUser(addUserDTO)
  }

  @Get('users')
  fetchAllUsers(){
    Logger.debug(`fetchAllUsers()`, APP);

   return this.videoToVitalsService.fetchAllUsers()

  }

  // @Get('users/:email/:mobile')
  // fetchAllUsersByEmailAndMobile(@Param() addUserDTO:AddUserDTO,){
  //   Logger.debug(`fetchAllUsertByEmailAndMobile() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

  //  return this.videoToVitalsService.fetchAllUsersByEmailAndMobile(addUserDTO)

  // }

  // @Get('users/:email')
  // fetchAllUsersByEmail(@Param() addUserDTO:AddUserDTO,){
  //   Logger.debug(`fetchAllUsertByEmail() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

  //  return this.videoToVitalsService.fetchAllUsersByEmail(addUserDTO)
  // }

  // @Get('users/:mobile')
  // fetchAllUsersByMobile(@Param() addUserDTO:AddUserDTO,){
  //   Logger.debug(`fetchAllUsertByMobile() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

  //  return this.videoToVitalsService.fetchAllUsersByMobile(addUserDTO)
  // }

  @Get('pilot')
  fetchAllPilot() {
    Logger.debug(`fetchAllPilot()`, APP);

    return this.videoToVitalsService.fetchAllPilot();
  }

  @Get('pilot/:id')
  fetchOnePilot(@Param('id',ParseIntPipe) id: number) {
    Logger.debug(`createPilot() id:${id} `, APP);

    return this.videoToVitalsService.fetchOnePilot(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVideoToVitalDto: UpdateVideoToVitalDto) {
  //   return this.videoToVitalsService.update(+id, updateVideoToVitalDto);
  // }

  @Patch('pilot/:id/image')
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

  async updateImage(@Param('id') id: string, @UploadedFile() file) {
    Logger.debug(`updateImage() id:${id} file:${file} `, APP);

    return this.videoToVitalsService.updateImage(id, file.filename);
  }

  @Delete('pilot/:id')
  deletePilot(@Param('id', ParseIntPipe) id: number) {
    return this.videoToVitalsService.deletePilot(id);
  }
}
