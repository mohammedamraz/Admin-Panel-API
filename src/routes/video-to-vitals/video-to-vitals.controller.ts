import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { CreateOrganizationDto,LoginUserDTO, LoginUserPasswordCheckDTO, OrgDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO, VitalUserDTO } from './dto/create-video-to-vital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { STATIC_IMAGES, STATIC_IMAGES_PROFILE } from 'src/constants';
import { editFileName, imageFileFilter } from 'src/constants/helper';
import { PasswordResetDTO } from '../admin/dto/create-admin.dto';

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

  @Get('org/:organization_name/:organization_email/:organization_mobile')
  fetchOrgByCondition(@Param() orgDTO: OrgDTO,) {
    Logger.debug(`fetchOrgByCondition() orgDTO:${JSON.stringify(orgDTO)} `, APP);

    return this.videoToVitalsService.fetchOrgByCondition(orgDTO)
  }

  @Patch('org/status')
  updateStatus() {
    return this.videoToVitalsService.updateStatus()
   } 

  @Get('org/:id')
  fetchOrganizationById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.videoToVitalsService.fetchOrganizationById(id);
  }

  @Patch('org/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      _destination:STATIC_IMAGES,
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
    Logger.debug(`updateOrganization() id:${id} file:${file} `, APP);

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

  
  @Get('vitals_count')
  fetchVitalsPilotCount() {
    Logger.debug(`fetchVitalsPilotCount()`, APP);

    return this.videoToVitalsService.fetchVitalsPilotCount()
  }

  @Get('/active_vitals_count')
  fetchActiveVitalsPilotCount() {
    Logger.debug(`fetchActiveVitalsPilotCount()`, APP);

    return this.videoToVitalsService.fetchActiveVitalsPilotCount()
  }

  @Get()
  fetchAllVitalsPilot() {
    Logger.debug(`fetchAllVitalsPilot()`, APP);

    return this.videoToVitalsService.fetchAllVitalsPilot()
  }

  @Get('latest')
  fetchFiveLatestVitalsPilot() {
    Logger.debug(`fetchAllVitalsPilot()`, APP);

    return this.videoToVitalsService.fetchFiveLatestVitalsPilot()
  }

  @Get('tests')
  fetchAllVitalsTestCount() {
    Logger.debug(`fetchAllVitalsTestCount()`, APP);

    return this.videoToVitalsService.fetchAllVitalsTestCount()
  }

  @Get(':id')
  fetchVitalsPilotById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchVitalsPilotById() id:${id} `, APP);

    return this.videoToVitalsService.fetchVitalsPilotById(id);
  }

  @Post('users')
  addUser(@Body() userDTO: UserDTO) {
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.videoToVitalsService.addUser(userDTO)
  }

  @Get('users/:email/:mobile')
  fetchUserByCondition(@Param() userDTO: UserDTO,) {
    Logger.debug(`fetchUserByEmailAndMobile() userDTO:${JSON.stringify(userDTO)} `, APP);

    return this.videoToVitalsService.fetchUserByCondition(userDTO)
  }

  @Get('users/users_count/:org_id')
  fetchUsersCountByOrgId(@Param('org_id',ParseIntPipe) org_id: number) {
    Logger.debug(`fetchUsersCountByOrgId org_id:${org_id}`, APP);

    return this.videoToVitalsService.fetchUsersCountByOrgId(org_id)
  }

  @Get('vitals_users/:org_id/:product_id')
  fetchAllUsersByOrgIdAndProductId(@Param() vitalUserDTO:VitalUserDTO ) {
    Logger.debug(`fetchAllUsersByOrgIdAndProductId()`, APP);

    return this.videoToVitalsService.fetchAllUsersByOrgIdAndProductId(vitalUserDTO)
  }

  @Get('vitals_users/latest/:org_id/:product_id')
  fetchFiveLatestUsersByOrgIdAndProductId(@Param() vitalUserDTO:VitalUserDTO) {
    Logger.debug(`fetchFiveLatestUsersByOrgIdAndProductId()`, APP);

    return this.videoToVitalsService.fetchFiveLatestUsersByOrgIdAndProductId(vitalUserDTO);
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

  // @Post('login/org')
  // loginOrgByEmail(@Body() loginOrgDTO: LoginOrgDTO) {
  //   Logger.debug(`loginUserByEmail()  loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

  //   return this.videoToVitalsService.loginOrgByEmail(loginOrgDTO)
  // }


  @Post('login/user')
  loginUserByEmail(@Body() loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginUserByEmail()  loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

    return this.videoToVitalsService.loginUserByEmail(loginUserDTO)
  }

  @Get('check/password')
  checkUserPasswordExistByEmail(@Body() loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`checkUserPasswordExistByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(loginUserPasswordCheckDTO)} `, APP);

    return this.videoToVitalsService.checkUserPasswordExistByEmail(loginUserPasswordCheckDTO)
  }


  @Patch('save/password')
  saveUserPasswordExistByEmail(@Body() loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`saveUserPasswordExistByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(loginUserPasswordCheckDTO)} `, APP);

    return this.videoToVitalsService.saveUserPasswordExistByEmail(loginUserPasswordCheckDTO)
  }

  @Patch('change/password')
  changeUserPasswordExistByEmail(@Body() loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`changeUserPasswordExistByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(loginUserPasswordCheckDTO)} `, APP);

    return this.videoToVitalsService.changeUserPasswordExistByEmail(loginUserPasswordCheckDTO)
  }

  @Post('change/password/email')
  sendEmailToChangeUserPasswordExistByEmail(@Body() passwordResetDTO: PasswordResetDTO) {
    Logger.debug(`sendEmailToChangeUserPasswordExistByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(passwordResetDTO)} `, APP);

    return this.videoToVitalsService.sendEmailToChangeUserPasswordExistByEmail(passwordResetDTO)
  }

  
}


