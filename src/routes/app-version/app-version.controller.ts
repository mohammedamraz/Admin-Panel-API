import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AppVersionService } from './app-version.service';
import { CreateIndustryTypeDTO } from '../industry-type/dto/create-industrytype.dto';
import { CreateAppVersionDTO } from './dto/create-appversion.dto';

const APP = 'AppVersionController';
@Controller()
export class AppVersionController {

    constructor(private readonly AppVersionService : AppVersionService) { }

    @Post()
    CreateAppVersion(@Body() CreateAppVersionDTO: CreateAppVersionDTO) {
        Logger.debug(`CreateAppVersion body : ${CreateIndustryTypeDTO}`, APP)

        return this.AppVersionService.CreateAppVersion(CreateAppVersionDTO)
    }

    @Get()
    GetAllAppVersion() {
        Logger.debug(`GetAllAppVersion`, APP)

        return this.AppVersionService.GetAllAppVersion()
    }

    @Get(':id')
    GetAppVersionById(@Param('id') id: number) {
        Logger.debug(`GetAppVersionById id : ${id}`, APP)

        return this.AppVersionService.GetAppVersionById(id)
    }

}
