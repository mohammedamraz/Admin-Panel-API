import { Body, Controller, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ZQueryParamsDto } from '../sales/dto/create-sale.dto';
import { CreateThirdPartyOrganizationDto, UpdateThirdPartyOrganizationJunctionDto } from './dto/create-third-party.dto';
import { ThirdpartyOrganizationService } from './thirdparty-organization.service';

const APP = "ThirdpartyOrganizationController"
@Controller()
export class ThirdpartyOrganizationController {

    constructor(
        private readonly thirdpartyOrganizationService: ThirdpartyOrganizationService,
        // private readonly organizationService: OrganizationService,
    ) { }

    @Post()
    addThirdPartyOrganization(@Body() createThirdPartyOrganizationDto: CreateThirdPartyOrganizationDto) {
        Logger.debug(`addThirdPartyOrganization() createProductDto:${JSON.stringify(createThirdPartyOrganizationDto)} }`, APP);

        return this.thirdpartyOrganizationService.addThirdPartyOrganization(createThirdPartyOrganizationDto);
    }

    @Get('list/:org_id')
    fetchThirdPartyOrganizationOfSpecificOrg(@Param('org_id') org_id: string,@Query() params: ZQueryParamsDto ) {
        Logger.debug(`fetchThirdPartyOrganizationOfSpecificOrg() createProductDto:${org_id }`, APP);

        return this.thirdpartyOrganizationService.fetchThirdPartyOrganizationOfSpecificOrg(org_id,params);
    }

}
