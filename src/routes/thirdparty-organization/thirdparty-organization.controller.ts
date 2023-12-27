import { Body, Controller, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ZQueryParamsDto } from '../sales/dto/create-sale.dto';
import { AuthAPIDto, CreateThirdPartyOrganizationDto, ParamsDto, RequestToAPIDto, UpdateThirdPartyOrganizationJunctionDto } from './dto/create-third-party.dto';
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

    @Patch(':id')
    patchThirdPartyOrganizationById(@Param('id') id : number , @Body() createThirdPartyOrganizationDto: CreateThirdPartyOrganizationDto) {
        Logger.debug(`patchThirdPartyOrganizationById() createProductDto:${JSON.stringify(createThirdPartyOrganizationDto)} }`, APP);

        return this.thirdpartyOrganizationService.patchThirdPartyOrganizationById(id,createThirdPartyOrganizationDto);
    }

    @Get('list/:org_id')
    fetchThirdPartyOrganizationOfSpecificOrg(@Param('org_id') org_id: string,@Query() params: ZQueryParamsDto ) {
        Logger.debug(`fetchThirdPartyOrganizationOfSpecificOrg() createProductDto:${org_id }`, APP);

        return this.thirdpartyOrganizationService.fetchThirdPartyOrganizationOfSpecificOrg(org_id,params);
    }

    @Post('api_url/:org_id/:id')
    fetchAPIUrlByThirdPartyOrganization(@Param() params : ParamsDto , @Body() body : RequestToAPIDto ) {
        Logger.debug(`fetchAPIUrlByThirdPartyOrganization() createProductDto:${body }`, APP);

        return this.thirdpartyOrganizationService.fetchAPIUrlByThirdPartyOrganization(params,body);
    }

    @Post('api_vitals_url/:org_id/:id')
    fetchAPIUrlByThirdPartyOrganizationId(@Param() params : ParamsDto , @Body() body : RequestToAPIDto ) {
        Logger.debug(`fetchAPIUrlByThirdPartyOrganizationId() createProductDto:${body }`, APP);

        return this.thirdpartyOrganizationService.fetchAPIUrlByThirdPartyOrganizationId(params,body);
    }


    @Post('auth_url/:org_id')
    authUrlEncryption(@Param('org_id')  org_id : number , @Body() body :  AuthAPIDto) {
        Logger.debug(`authUrlEncryption() createProductDto: ${body}}`, APP);

        return this.thirdpartyOrganizationService.authUrlEncryption(org_id,body);
    }

    @Post('auth_vitals/:org_id/:id')
    authUrlEncryptionVitalsUrl(@Param() params : ParamsDto , @Body() body : any ) {
        Logger.debug(`authUrlEncryptionVitalsUrl() createProductDto:${body }`, APP);

        return this.thirdpartyOrganizationService.authUrlEncryptionVitalsUrl(params,body);
    }

    @Post('auth_status/:org_id/:id')
    authUrlEncryptionStatusUrl(@Param() params : ParamsDto , @Body() body : any ) {
        Logger.debug(`authUrlEncryptionStatusUrl() createProductDto:${body }`, APP);

        return this.thirdpartyOrganizationService.authUrlEncryptionStatusUrl(params,body);
    }

    @Post('auth_sample_url')
    sampleUrlForAuth(@Body() body : RequestToAPIDto) {
        Logger.debug(`sampleUrlForAuth() }`, APP);

        return this.thirdpartyOrganizationService.sampleUrlForAuth(body);
    }


}
