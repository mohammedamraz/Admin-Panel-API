import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateLevelDTO } from './dto/create-level.dto';
import { ScanLevelService } from './scan-level.service';

const APP = 'ScanLevelController'
@Controller()
export class ScanLevelController {
    constructor(
        private readonly ScanLevelService: ScanLevelService
    ) {

    }

    @Post()
    CreateScanLevel(@Body() CreateLevelDTO: CreateLevelDTO) {
        Logger.debug(`CreateScanLevel body : ${CreateLevelDTO}`, APP)

        return this.ScanLevelService.CreateScanLevel(CreateLevelDTO)
    }

    @Get()
    GetAllScanLevels() {
        Logger.debug(`GetAllScanLevels`, APP)

        return this.ScanLevelService.GetAllScanLevels()
    }

    @Get(':id')
    GetScanLevelById(@Param('id') id: number) {
        Logger.debug(`GetScanLevelById id : ${id}`, APP)

        return this.ScanLevelService.GetScanLevelById(id)
    }

}
