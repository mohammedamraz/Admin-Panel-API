import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, ParseIntPipe, UseInterceptors, UploadedFile, Query, UsePipes } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { CreateOrganizationDto, LoginUserDTO, LoginUserPasswordCheckDTO, OrgDTO, ProductDto, QueryParamsDto, RegisterUserDTO, UpdateOrganizationDto, UpdateUserDTO, UpdateWholeOrganizationDto, UserDTO, UserParamDto, VitalUserDTO } from './dto/create-video-to-vital.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EncryptUrlDTO, PasswordResetDTO, sendEmailOnCreationOfOrgAndUser } from '../admin/dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO } from '../admin/dto/login.dto';
import { OrganizationService } from './organization.service';
import { UsersService } from './users.service';
import { LoggingInterceptor } from 'src/interceptors/interceptor';
import { ZQueryParamsDto } from '../org-product-junction/dto/create-org-product-junction.dto';
import { Cron } from '@nestjs/schedule';
import { JoiValidationPipe } from 'src/constants/pipes';
import { url } from 'inspector';


const APP = "VideoToVitalsController"
@Controller()
export class VideoToVitalsController {
  constructor(
    private readonly videoToVitalsService: VideoToVitalsService,
    private readonly organizationService: OrganizationService,
    private readonly usersService: UsersService,
  ) { }

  @Post('org')
  @UsePipes(new JoiValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  createOrganization(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() file) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto)} file:${JSON.stringify(file)}`, APP);

    return this.organizationService.createOrganization(createOrganizationDto, file);
  }

  @Post('org/direct')
  @UsePipes(new JoiValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  createOrganizationAndDirectRegister(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() file) {
    Logger.debug(`createOrganizationAndDirectRegister() createOrganizationDto:${JSON.stringify(createOrganizationDto)} file:${JSON.stringify(file)}`, APP);

    return this.organizationService.createOrganizationAndDirectRegister(createOrganizationDto, file);
  }

  @Get('org/count')
  fetchOrgCount(@Query() queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchOrgByCount()`, APP);

    return this.organizationService.fetchOrgCount(queryParamsDto)
  }

  //this should be checked if this is working properly with other controllers 
  @Get('org/max_test/users')
  fetchTotalTestOfOrgAndMaxTestByUser() {
    Logger.debug(`fetchTotalTestOfOrgAndMaxTestByUser() `, APP);

    return this.usersService.fetchTotalTestOfOrgAndMaxTestByUser()
  }

  @Get('org')
  fetchAllOrganization(@Query() queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchAllOrganization() queryParamsDto: ${JSON.stringify(queryParamsDto)}`, APP);

    return this.organizationService.fetchAllOrganization(queryParamsDto);
  }

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

  // @Get('org/domain/:url')
  // fetchOrgByUrl(@Param() url: string,) {
  //   Logger.debug(`fetchOrgByUrl() url:${url} `, APP);

  //   return this.videoToVitalsService.fetchOrgByUrl(url)
  // }

  // @Patch('org/status')
  // updateStatus() {
  //   return this.videoToVitalsService.updateStatus()
  //  } 

  @Get('org/:id')
  fetchOrganizationById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.organizationService.fetchOrganizationById(id);
  }

  // @Get('org/name/:url')
  // fetchOrganizationDetailsByUrl(@Param ('url') url: string) {
  //   Logger.debug(`fetchOrganizationByName() url:${url} `, APP);

  //   return this.organizationService.fetchOrganizationDetailsByUrl(url);
  // }

  @Patch('org/logo/:id')
  @UseInterceptors(FileInterceptor('file'))
  patchImageToOrganization(@Param('id', ParseIntPipe) id: number, @UploadedFile() file) {
    Logger.debug(`patchImageToOrganization() id:${id}  file:)}`, APP);

    return this.organizationService.patchImageToOrganization(id, file);
  }

  @Patch('org/:id')
  updateOrganization(@Param('id', ParseIntPipe) id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    Logger.debug(`updateOrganization() id:${id} updateOrganizationDto: ${JSON.stringify(updateOrganizationDto)} `, APP);

    return this.organizationService.updateOrganization(id, updateOrganizationDto);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe())
  @UseInterceptors(FileInterceptor('file'))

  updateOrganizationByFedoAdmin(@Param('id', ParseIntPipe) id: number, @Body() updateWholeOrganizationDto: UpdateWholeOrganizationDto, @UploadedFile() file) {
    Logger.debug(`updateOrganizationByFedoAdmin() id:${id} updateWholeOrganizationDto: ${JSON.stringify(updateWholeOrganizationDto)} `, APP);

    return this.organizationService.updateOrganizationByFedoAdmin(id, updateWholeOrganizationDto, file);
  }



  @Patch('org/register/status/:id')
  changeRegisterStatusOnceConfirmed(@Param('id') id: number, @Query() queryParamsDto: QueryParamsDto) {
    Logger.debug(`updateOrganization() id:${id}  `, APP);

    return this.videoToVitalsService.changeRegisterStatusOnceConfirmed(id, queryParamsDto);
  }

  @Patch('user/register/status/:id')
  changeUserRegisterStatusOnceConfirmed(@Param('id') id: number) {
    Logger.debug(`changeUserRegisterStatusOnceConfirmed() id:${id}  `, APP);

    return this.usersService.changeUserRegisterStatusOnceConfirmed(id);
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

  @Get(':id')
  fetchAllVitalsPilot(@Param('id',ParseIntPipe) id: number, @Query() queryParamsDto: QueryParamsDto ) {
    Logger.debug(`fetchAllVitalsPilot() product_id:${id} queryParamsDto:${JSON.stringify(queryParamsDto)}`, APP);

    return this.videoToVitalsService.fetchAllVitalsPilot(id, queryParamsDto)
  }

  @Get('tests/:id')
  fetchAllVitalsTestCount(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchAllVitalsTestCount() product_id:${id}`, APP);

    return this.videoToVitalsService.fetchAllVitalsTestCount(id)
  }

  @Post('users')
  @UsePipes(new JoiValidationPipe())
  addUser(@Body() userDTO: UserDTO) {
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.videoToVitalsService.addUser(userDTO)
  }

  @Post('users/direct')
  @UsePipes(new JoiValidationPipe())
  addUserAndDirectRegister(@Body() userDTO: UserDTO) {
    Logger.debug(`addUserAndDirectRegister() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.videoToVitalsService.addUserAndDirectRegister(userDTO)
  }
  
  @Get('junction/domain/:url')
  fetchOrgByUrlFromJunction(@Param('url') url: string) {
    Logger.debug(`fetchOrgByUrlFromJunction()`, APP);

    return this.organizationService.fetchOrgByUrlFromJunction(url)
  }


  @Get('users/:org_id')
  fetchAllUsers(@Param('org_id', ParseIntPipe) org_id: number, @Query() userParamDto: UserParamDto) {
    Logger.debug(`fetchAllUsers()`, APP);

    return this.usersService.fetchAllUsers(org_id, userParamDto)
  }

  @Get('users/:email/:mobile')
  fetchUserByCondition(@Param() userDTO: UserDTO,) {
    Logger.debug(`fetchUserByEmailAndMobile() userDTO:${JSON.stringify(userDTO)} `, APP);

    return this.usersService.fetchUserByCondition(userDTO)
  }

  @Get('users/users_count/:org_id')
  fetchUsersCountByOrgId(@Param('org_id', ParseIntPipe) org_id: number) {
    Logger.debug(`fetchUsersCountByOrgId org_id:${org_id}`, APP);

    return this.videoToVitalsService.fetchUsersCountByOrgId(org_id)
  }

  @Get('users/data/list/:id')
  fetchUserDetailsById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchUserDetailsById()`, APP);

    return this.videoToVitalsService.fetchUserDetailsById(id)
  }

  @Get('users/data/product/list/:id')
  fetchUserProductDetailsById(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`fetchUserProductDetailsById()`, APP);

    return this.videoToVitalsService.fetchUserProductDetailsById(id)
  } 


  @Delete('users/:id')
  deleteUserByID(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`deleteUserByID()`, APP);

    return this.videoToVitalsService.deleteUserByID(id);
  }

  @Patch('users/:id')
  @UsePipes(new JoiValidationPipe())
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

  @Post('signup/web')
  @UseInterceptors(FileInterceptor('file'))
  // @UseInterceptors(LoggingInterceptor)
  registerWebSiteUserbyEmail(@Body() RegisterUserdto: RegisterUserDTO) {
    Logger.debug(`registerWebSiteUserbyEmail()  loginUserDTO:${JSON.stringify(RegisterUserdto)} `, APP);

    return this.videoToVitalsService.registerWebSiteUserbyEmail(RegisterUserdto)
  }

  @Post('confirm/signup')
  // @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  confirmSignupUserByEmail(@Body() registerUserdto: RegisterUserDTO) {
    Logger.debug(`confirmSignupUserByEmail() [${JSON.stringify(Object.keys(registerUserdto))} values ${JSON.stringify(Object.values(registerUserdto).length)}]`, APP);

    return this.videoToVitalsService.confirmSignupUserByEmail(registerUserdto);
  }

  @Post('login/user')
  // @UseInterceptors(LoggingInterceptor)
  loginUserByEmail(@Body() loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginUserByEmail()  loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);

    return this.videoToVitalsService.loginUserByEmail(loginUserDTO)
  }

  // @Post('login/org')
  // // @UseInterceptors(LoggingInterceptor)
  // loginOrganizationByEmail(@Body() loginUserDTO: LoginUserDTO) {
  //   Logger.debug(`loginOrganizationByEmail()  loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);

  //   return this.videoToVitalsService.loginOrganizationByEmail(loginUserDTO)
  // }

  @Patch('user/details')
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

  // @Patch('org/stage/:id')
  // markAsWonAndLost(@Param('id', ParseIntPipe) id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {
  //   Logger.debug(`updateOrganization() id:${id} updateOrganizationDto: ${JSON.stringify(updateOrganizationDto)} `, APP);

  //   return this.organizationService.updateOrganization(id, updateOrganizationDto);
  // }

  // @Cron('30 6 0 * * *', { timeZone: 'Asia/Kolkata', })
  // fetchOrgDetailsByExpiryDateForDays(@Query() params: ZQueryParamsDto){
  //   Logger.debug(`fetchOrgDetailsByExpiryDateForDays() params:${params}} `, APP);

  //  return this.organizationService.fetchOrgDetailsByExpiryDateForDays(params)
  // }


  @Cron('30 6 0 * * *', { timeZone: 'Asia/Kolkata', })
  fetchOrgDetailsByExpiryDateOrgExpired(@Query() params: ZQueryParamsDto){
    Logger.debug(`fetchOrgDetailsByExpiryDateOrgExpired() params:${params}} `, APP);

   return this.organizationService.fetchOrgDetailsByExpiryDateOrgExpired(params)
  }

  @Post('delete/last_org_row')
  deleteLastOrgRow() {
    Logger.debug(`deleteLastOrgRow() []`, APP);

    return this.organizationService.deleteLastOrgRow();
  }

  @Post('delete/last_user_row')
  deleteLastUserRow() {
    Logger.debug(`deleteLastUserRow() []`, APP);

    return this.usersService.deleteLastUserRow();
  }

  @Post('generateScanLink')
  generateEncryptedUrlForCanara(@Body() EncryptUrlDTO: EncryptUrlDTO) {
    Logger.debug(`generateEncryptedUrlForCanara()  EncryptUrlDTO:${JSON.stringify(EncryptUrlDTO)} `, APP);

    return this.organizationService.generateEncryptedUrlForCanara(EncryptUrlDTO)
  }

  @Post('generateEncryptedScanLink')
  generateEncryptedUrlForHealthIndia(@Body() EncryptUrlDTO: EncryptUrlDTO) {
    Logger.debug(`generateEncryptedUrlForHealthIndia()  EncryptUrlDTO:${JSON.stringify(EncryptUrlDTO)} `, APP);

    return this.organizationService.generateEncryptedUrlForHealthIndia(EncryptUrlDTO)
  }

  @Post('pre_signed/video/save')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideoTOPresignedUrl(@UploadedFile() file, @Query('policy_number') policy_number : any) {
    Logger.debug(`uploadVideoTOPresignedUrl()`, APP);

    return this.organizationService.uploadVideoTOPresignedUrl( file , policy_number);
  }

  @Post('pre_signed/pdf/save')
  uploadPDFTOPresignedUrl(@Body() body:sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`uploadPDFTOPresignedUrl()`, APP);

    return this.organizationService.uploadPDFTOPresignedUrl(body);
  }
}


