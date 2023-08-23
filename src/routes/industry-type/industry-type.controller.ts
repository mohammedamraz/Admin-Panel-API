import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { IndustryTypeService } from './industry-type.service';
import { CreateIndustryTypeDTO } from './dto/create-industrytype.dto';

const APP = 'IndustryTypeController';
@Controller()
export class IndustryTypeController {

    constructor(private readonly IndustryTypeService : IndustryTypeService) { }

    @Post()
    CreateIndustryType(@Body() CreateIndustryTypeDTO: CreateIndustryTypeDTO) {
        Logger.debug(`CreateIndustryType body : ${CreateIndustryTypeDTO}`, APP)

        return this.IndustryTypeService.CreateIndustryType(CreateIndustryTypeDTO)
    }

    @Get()
    GetAllIndustryType() {
        Logger.debug(`GetAllIndustryType`, APP)

        return this.IndustryTypeService.GetAllIndustryType()
    }

    @Get(':id')
    GetIndustryTypeById(@Param('id') id: number) {
        Logger.debug(`GetIndustryTypeById id : ${id}`, APP)

        return this.IndustryTypeService.GetIndustryTypeById(id)
    }
}
