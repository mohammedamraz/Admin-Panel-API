import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { CreateOrganizationDto,EmailConfirmationDTO,LoginUserDTO, LoginUserPasswordCheckDTO, OrgDTO, ProductDto, QueryParamsDto, RegisterUserDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO, UserParamDto, VitalUserDTO } from './dto/create-video-to-vital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PasswordResetDTO } from '../admin/dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO } from '../admin/dto/login.dto';
import { OrganizationService } from './organization.service';


const APP = "VideoToVitalsController"
@Controller()
export class VideoToVitalsController {
  constructor(
    private readonly videoToVitalsService: VideoToVitalsService,
    private readonly organizationService: OrganizationService,
    ) { }

  @Post('org')
  @UseInterceptors(FileInterceptor('file'))
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     _destination: STATIC_IMAGES,
  //     // get destination() {
  //     //   return this._destination;
  //     // },
  //     // set destination(value) {
  //     //   this._destination = value;
  //     // },
  //     filename: editFileName
  //   }),
  //   fileFilter: imageFileFilter
  // }))
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() file) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto)} file:${JSON.stringify(file)}`, APP);

    // return this.videoToVitalsService.uploadFile(file?.path)

    return this.organizationService.createOrganization(createOrganizationDto, file);
  }

  @Get('org/count')
  fetchOrgCount() {
    Logger.debug(`fetchOrgByCount()`, APP);

    return this.organizationService.fetchOrgCount()
  }

  @Get('org')
  fetchAllOrganization( @Query() queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchAllOrganization() queryParamsDto: ${JSON.stringify(queryParamsDto)}`, APP);

    return this.organizationService.fetchAllOrganization(queryParamsDto);
  }

  // @Get('org/latest')
  // fetchFiveLatestOrganization() {
  //   Logger.debug(`fetchFiveLatestOrganization()`, APP);

  //   return this.organizationService.fetchFiveLatestOrganization();
  // }

  @Get('org/product/access/:id')
  findAllProductsMappedWithOrganization(@Param('id') id: string) {
    Logger.debug(`findAllProductsMappedWithOrganization()`, APP);
    
    return this.organizationService.findAllProductsMappedWithOrganization(+id);
  }


  
  @Get('org/:organization_name/:organization_email/:organization_mobile')
  fetchOrgByCondition(@Param() orgDTO: OrgDTO,) {
    Logger.debug(`fetchOrgByCondition() orgDTO:${JSON.stringify(orgDTO)} `, APP);

    return this.organizationService.fetchOrgByCondition(orgDTO)
  }

  // @Get('org')
  // fetchOrgByUrl(@Query() url: string,) {
  //   Logger.debug(`fetchOrgByUrl() url:${url} `, APP);

  //   return this.organizationService.fetchOrgByUrl(url)
  // }

  // @Patch('org/status')
  // updateStatus() {
  //   return this.organizationService.updateStatus()
  //  } 

  @Get('org/:id')
  fetchOrganizationById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.organizationService.fetchOrganizationById(id);
  }

  @Patch('org/logo/:id')
  @UseInterceptors(FileInterceptor('file'))
  patchImageToOrganization( @Param('id', ParseIntPipe) id: number,@UploadedFile() file) {
    Logger.debug(`patchImageToOrganization() id:${id}  file:)}`, APP);

    return this.organizationService.patchImageToOrganization(id, file);
  }
  

  @Patch('org/:id')
  updateOrganization(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    Logger.debug(`updateOrganization() id:${id}  `, APP);

    return this.organizationService.updateOrganization(id, updateOrganizationDto);
  }

  @Patch('org/register/status/:id')
  changeRegisterStatusOnceConfirmed(@Param('id') id: number) {
    Logger.debug(`updateOrganization() id:${id}  `, APP);

    return this.videoToVitalsService.changeRegisterStatusOnceConfirmed(id);
  }


  @Delete('org/logo/:id')
  deleteLogo(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.deleteLogo(id);
  }

  @Delete('org/:id')
  deleteOrganizationByID(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.deleteOrganizationByID(id);
  }

  
  @Get('count')
  fetchPilotCount(@Query() productDto: ProductDto) {
    Logger.debug(`fetchPilotCount() ProductDto: ${JSON.stringify(productDto)}`, APP);

    return this.videoToVitalsService.fetchPilotCount(productDto)
  }

  // @Get('/active_vitals_count')
  // fetchActiveVitalsPilotCount() {
  //   Logger.debug(`fetchActiveVitalsPilotCount()`, APP);

  //   return this.videoToVitalsService.fetchActiveVitalsPilotCount()
  // }

  @Get()
  fetchAllVitalsPilot(@Query() queryParamsDto: QueryParamsDto ) {
    Logger.debug(`fetchAllVitalsPilot()`, APP);

    return this.videoToVitalsService.fetchAllVitalsPilot(queryParamsDto)
  }

  // @Get('latest')
  // fetchFiveLatestVitalsPilot() {
  //   Logger.debug(`fetchAllVitalsPilot()`, APP);

  //   return this.videoToVitalsService.fetchFiveLatestVitalsPilot()
  // }

  @Get('tests')
  fetchAllVitalsTestCount() {
    Logger.debug(`fetchAllVitalsTestCount()`, APP);

    return this.videoToVitalsService.fetchAllVitalsTestCount()
  }

  // @Get(':org_id')
  // fetchVitalsPilotById(@Param('org_id',ParseIntPipe ) org_id: number) {
  //   Logger.debug(`fetchVitalsPilotById() id:${org_id} `, APP);

  //   return this.videoToVitalsService.fetchVitalsPilotById(org_id);
  // }

  @Post('users')
  addUser(@Body() userDTO: UserDTO) {
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

  return this.videoToVitalsService.addUser(userDTO)
  }

  @Get('users/:org_id')
  fetchAllUsers(@Param('org_id',ParseIntPipe) org_id:number, @Query() userParamDto: UserParamDto){
    Logger.debug(`fetchAllUsers()`, APP);

    return this.videoToVitalsService.fetchAllUsers(org_id,userParamDto)
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

  @Post('signup/user')
  // @UseInterceptors(LoggingInterceptor)
  registerUserbyEmail(@Body() RegisterUserdto: RegisterUserDTO) {
    Logger.debug(`registerUserbyEmail()  loginUserDTO:${JSON.stringify(RegisterUserdto)} `, APP);

    return this.videoToVitalsService.registerUserbyEmail(RegisterUserdto)
  }

  @Post('confirm/signup')
  // @UseInterceptors(LoggingInterceptor)
  confirmSignupUserByEmail(@Body() registerUserdto: RegisterUserDTO) {
    Logger.debug(`confirmSignupUserByEmail() [${JSON.stringify(Object.keys(registerUserdto))} values ${JSON.stringify(Object.values(registerUserdto).length)}]`, APP);

    return this.videoToVitalsService.confirmSignupUserByEmail(registerUserdto);
  }

  // @Post('email/otp')
  // confirmEmail(@Body() confirmEmailDTO: EmailConfirmationDTO) {
  //   Logger.debug(`confirmEmail() confirmEmailDTO:[${JSON.stringify(confirmEmailDTO,)}]`,);

  //   return this.videoToVitalsService.confirmEmail(confirmEmailDTO);
  // } 

  // @Post('email/otp/:code')
  // confirmEmailOtp(@Body() confirmEmailOtpDTO: EmailConfirmationDTO, @Param('code') otp: string) {
  //   Logger.debug(`confirmEmailOtp() confirmEmailOtpDTO:[${JSON.stringify(confirmEmailOtpDTO,)}] otp:[${otp.length}]`,);

  //   return this.videoToVitalsService.confirmEmailOtp(confirmEmailOtpDTO, otp);
  // }


  @Post('login/user')
  // @UseInterceptors(LoggingInterceptor)
  loginUserByEmail(@Body() loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginUserByEmail()  loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);

    return this.videoToVitalsService.loginUserByEmail(loginUserDTO)
  }

  @Post('login/org')
  // @UseInterceptors(LoggingInterceptor)
  loginOrganizationByEmail(@Body() loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginOrganizationByEmail()  loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);

    return this.videoToVitalsService.loginOrganizationByEmail(loginUserDTO)
  }

  @Get('user/details')
  getOrganisationDetailsOfUserByEmail(@Body() loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`getOrganisationDetailsOfUserByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(loginUserPasswordCheckDTO)} `, APP);

    return this.videoToVitalsService.getOrganisationDetailsOfUserByEmail(loginUserPasswordCheckDTO)
  }

  @Post('password')
  // @UseInterceptors(LoggingInterceptor)
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    Logger.debug(`forgotPassword() forgotPasswordDTO:[${JSON.stringify(forgotPasswordDTO,)}]`,);

    return this.videoToVitalsService.forgotPassword(forgotPasswordDTO);
  }

  @Post('password/otp')
  // @UseInterceptors(LoggingInterceptor)
  confirmForgotPassword(@Body() confirmForgotPasswordDTO: ConfirmForgotPasswordDTO,) {
    Logger.debug(`confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(confirmForgotPasswordDTO,)}]`,);

    return this.videoToVitalsService.confirmForgotPassword(confirmForgotPasswordDTO);
  }

  @Get('check/password')
  checkUserPasswordExistByEmail(@Body() loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`checkUserPasswordExistByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(loginUserPasswordCheckDTO)} `, APP);

    return this.videoToVitalsService.checkUserPasswordExistByEmail(loginUserPasswordCheckDTO)
  }


  @Post('change/password/email')
  sendEmailToChangeUserPasswordExistByEmail(@Body() passwordResetDTO: PasswordResetDTO) {
    Logger.debug(`sendEmailToChangeUserPasswordExistByEmail()  loginUserPasswordCheckDTO:${JSON.stringify(passwordResetDTO)} `, APP);

    return this.videoToVitalsService.sendEmailToChangeUserPasswordExistByEmail(passwordResetDTO)
  }

  
}


