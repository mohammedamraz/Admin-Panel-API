import { Body, Controller, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateProfileInfoDTO, ZQueryParamsDto } from './dto/create-video-to-vital.dto';
import { ProfileInfoService } from './profile-info.service';
const APP = "ProfileViewController"
@Controller()
export class ProfileInfoController {

    constructor(private readonly profileInfoService: ProfileInfoService) { }


    @Patch('info')
  updateProfileInfo( @Body() createProfileInfoDTO: CreateProfileInfoDTO) {
    Logger.debug(`updateProfileInfo()  updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

    return this.profileInfoService.updateProfileInfo( createProfileInfoDTO);
  }

  @Post('profile')
  createProfileInfo( @Body() createProfileInfoDTO: CreateProfileInfoDTO) {
    Logger.debug(`createProfileInfo()  updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

    return this.profileInfoService.createProfileInfo( createProfileInfoDTO);
  }

  @Post('info/save')
  addInfo(@Body() createProfileInfoDTO: CreateProfileInfoDTO) {
    
    return this.profileInfoService.addInfo(createProfileInfoDTO);

  }

  @Get('info/:user_id')
  fetchProfileByUserId(@Param('user_id') user_id: number) {
    Logger.debug(`fetchProfileByUserId()`, APP);

    return this.profileInfoService.fetchProfileByUserId(user_id)
  }

  @Get('profile/:org_id')
  fetchProfileByOrgId(@Param('org_id') org_id: number) {
    Logger.debug(`fetchProfileByOrgId()`, APP);

    return this.profileInfoService.fetchProfileByOrgId(org_id)
  }

  @Get('profile/info/query')
  fetchProfileByOrgIdByQueryParams(@Query() params: ZQueryParamsDto) {
    Logger.debug(`fetchProfileByOrgId() params:${JSON.stringify(params)}`, APP);

    return this.profileInfoService.fetchProfileByOrgIdByQueryParams(params)
  }

  @Patch('user/tests/:application_id/:product_id')
  updateTotalTestsInProfileInfo( @Param() createProfileInfoDTO: CreateProfileInfoDTO) {
    Logger.debug(`updateProfileInfo()  updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

    return this.profileInfoService.updateTotalTestsInProfileInfo( createProfileInfoDTO);
  }

  @Get('user/tests/:app_id')
  fetchProfileInfoByApplicationId( @Param('app_id') app_id: string) {
    Logger.debug(`fetchProfileInfoByApplicationId()  app_id:${app_id} `, APP);

    return this.profileInfoService.fetchProfileInfoByApplicationId( app_id);
  }




}
