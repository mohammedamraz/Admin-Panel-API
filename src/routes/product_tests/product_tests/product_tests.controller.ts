import { Body, Controller, Get, Logger, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductTestsDto } from './dto/create-product_tests.dto';
import { ProductTestsService } from './product_tests.service';
const APP = "VideoToVitalsController"

@Controller()
export class ProductTestsController {
    constructor(private readonly ProductTestsService: ProductTestsService) { }

  @Get('org')
  fetchTotalTestsOfOrg(@Query() params :ProductTestsDto) {
    Logger.debug(`fetchTotalTestsOfOrg()`, APP);

    return this.ProductTestsService.fetchTotalTestsOfOrg(params)
  }

  @Get('users')
  fetchTotalTestsOfUsers(@Query() params :ProductTestsDto) {
    Logger.debug(`fetchTotalTestsOfUsers()`, APP);

    return this.ProductTestsService.fetchTotalTestsOfUsers(params)
  }


  @Get('tests/org')
  fetchTotalTestsOfOrgByTime(@Query() params :ProductTestsDto) {
    Logger.debug(`fetchTotalTestsOfOrgByTime()`, APP);

    return this.ProductTestsService.fetchTotalTestsOfOrgByTime(params)
  }

  @Get('tests/users')
  fetchTotalTestsOfUsersByTime(@Query() params :ProductTestsDto) {
    Logger.debug(`fetchTotalTestsOfUsersByTime()`, APP);

    return this.ProductTestsService.fetchTotalTestsOfUsersByTime(params)
  }

  @Patch('vitals/report')
  updateTestReportInProductTest( @Query() params :ProductTestsDto,@Body()data :ProductTestsDto) {
    Logger.debug(`updateTestReportInProductTest()  updateUserDTO:${JSON.stringify(params)} `, APP);

    return this.ProductTestsService.updateTestReportInProductTest( params,data);
  }

  @Post('save_report')
  saveTestsToProductTests(@Body() body :ProductTestsDto) {
    Logger.debug(`saveTestsToProductTests()`, APP);

    return this.ProductTestsService.saveTestsToProductTests(body)
  }

  @Post('video/save')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideoToAWS(@UploadedFile() file) {
    Logger.debug(`uploadVideoToAWS()`, APP);

    return this.ProductTestsService.upload( file);
  }

}
