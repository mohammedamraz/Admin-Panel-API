import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { CreateOrganizationDto, OrgDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO } from './dto/create-video-to-vital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { STATIC_IMAGES, STATIC_IMAGES_PROFILE } from 'src/constants';
import { editFileName, imageFileFilter } from 'src/constants/helper';

const APP = "VideoToVitalsController"
@Controller()
export class VideoToVitalsController {
  constructor(private readonly videoToVitalsService: VideoToVitalsService) { }

  @Post('org')
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
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() file) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto)} file:${JSON.stringify(file)}`, APP);

    return this.videoToVitalsService.createOrganization(createOrganizationDto, file?.path);
  }

  @Get('org/count')
  fetchOrgCount() {
    Logger.debug(`fetchOrgByCount()`, APP);

    return this.videoToVitalsService.fetchOrgCount()
  }

  @Get('org/vitals_count')
  fetchVitalsPilotCount() {
    Logger.debug(`fetchVitalsPilotCount()`, APP);

    return this.videoToVitalsService.fetchVitalsPilotCount()
  }

  @Get('org/active_vitals_count')
  fetchActiveVitalsPilotCount() {
    Logger.debug(`fetchActiveVitalsPilotCount()`, APP);

    return this.videoToVitalsService.fetchActiveVitalsPilotCount()
  }


  @Get('org/:organization_name/:organization_email/:organization_mobile')
  fetchOrgByCondition(@Param() orgDTO: OrgDTO,) {
    Logger.debug(`fetchOrgByCondition() orgDTO:${JSON.stringify(orgDTO)} `, APP);

    return this.videoToVitalsService.fetchOrgByCondition(orgDTO)
  }

  @Patch('org/status')
  updateStatus() {
    return this.videoToVitalsService.updateStatus()
   } 

  @Get('org')
  fetchAllOrganization() {
    Logger.debug(`fetchAllOrganization()`, APP);

    return this.videoToVitalsService.fetchAllOrganization();
  }

  @Get('org/latest')
  fetchFiveLatestOrganization() {
    Logger.debug(`fetchFiveLatestOrganization()`, APP);

    return this.videoToVitalsService.fetchFiveLatestOrganization();
  }

  @Get('org/:id')
  fetchOrganizationById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.videoToVitalsService.fetchOrganizationById(id);
  }

  @Patch('org/:id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      _destination: STATIC_IMAGES,
      // get destination() {
      //   return this._destination;
      // },
      // set destination(value) {
      //   this._destination = value;
      // },
      filename: editFileName
    }),
    fileFilter: imageFileFilter
  }))

  async updateOrganization(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @UploadedFile() file) {
    Logger.debug(`updateImage() id:${id} file:${file} `, APP);

    return this.videoToVitalsService.updateOrganization(id, updateOrganizationDto, file?.path);
  }

  @Delete('org/logo/:id')
  deleteLogo(@Param('id', ParseIntPipe) id: number) {
    return this.videoToVitalsService.deleteLogo(id);
  }

  @Delete('org/:id')
  deleteOrganizationByID(@Param('id', ParseIntPipe) id: number) {
    return this.videoToVitalsService.deleteOrganizationByID(id);
  }


  @Post('users')
  addUser(@Body() userDTO: UserDTO) {
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.videoToVitalsService.addUser(userDTO)
  }

  @Get('users/users_count/:org_id')
  fetchUsersCountByOrgId(@Param('org_id',ParseIntPipe) org_id: number) {
    Logger.debug(`fetchUsersCountByOrgId org_id:${org_id}`, APP);

    return this.videoToVitalsService.fetchUsersCountByOrgId(org_id)
  }
  @Get('users/latest')
  fetchFiveLatestUsers() {
    Logger.debug(`fetchFiveLatestUsers()`, APP);

    return this.videoToVitalsService.fetchFiveLatestUsers();
  }

  @Get('users/:email/:mobile')
  fetchUserByCondition(@Param() userDTO: UserDTO,) {
    Logger.debug(`fetchUserByEmailAndMobile() userDTO:${JSON.stringify(userDTO)} `, APP);

    return this.videoToVitalsService.fetchUserByCondition(userDTO)
  }

  @Get('users')
  fetchAllUsers() {
    Logger.debug(`fetchAllUsers()`, APP);

    return this.videoToVitalsService.fetchAllUsers()
  }

  @Get('users/:id')
  fetchUserById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchUserById()`, APP);

    return this.videoToVitalsService.fetchUserById(id)
  }

  @Delete('users/:id')
  deleteUserByID(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`deleteUserByID()`, APP);

    return this.videoToVitalsService.deleteUserByID(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    Logger.debug(`updateUser() id:${id} updateUserDTO:${JSON.stringify(updateUserDTO)} `, APP);

    return this.videoToVitalsService.updateUser(id, updateUserDTO);
  }

}
