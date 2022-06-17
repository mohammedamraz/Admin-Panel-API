import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query, UseInterceptors, ParseIntPipe, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSalesPartner, Period, UpdateSalesPartner, YearMonthDto, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
import { diskStorage } from 'multer';
import { STATIC_IMAGES_PROFILE } from 'src/constants';
import { editFileName, imageFileFilter } from 'src/constants/helper';
import { SalesCommissionService } from './sales-commission.service';

const APP = 'SalesController';
@Controller()
export class SalesController {
  constructor(private readonly salesService: SalesService, private readonly salesCommissionService: SalesCommissionService) { }

  @Post()
  createSalesPartner(@Body() createSalesPartner: CreateSalesPartner) {
    Logger.debug(`createSalesPartner() DTO:${JSON.stringify(createSalesPartner,)}`, APP);

    return this.salesService.createSalesPartner(createSalesPartner)
  }


  @Delete(':id')
  deleteSalesPartner(@Param('id') id: string) {
    Logger.debug(`deleteSalesPartner() id: [${id}]`, APP);

    return this.salesService.deleteSalesPartner(id);
  }

  @Get(':id')
  fetchSalesPartnerById(@Param('id') id: string) {
    Logger.debug(`fetchSalesPartnerById() id: [${id}]`, APP);

    return this.salesService.fetchSalesPartnerById(id);
  }


  @Get(':id/sales-junction')
  fetchAllSalesPartnersFromJunctionByDate(@Param('id') id: string, @Query() params: ZQueryParamsDto) {
    Logger.debug(`fetchAllSalesPartnersFromJunctionByDate() id: [${id}] params:${JSON.stringify(params)}`, APP);

    return this.salesService.fetchAllSalesPartnersFromJunctionByDate(id, params)
  }

  @Get()
  fetchAllSalesPartnersByDate(@Query() params: ZQueryParamsDto) {
    Logger.debug(`fetchAllSalesPartnersByDate() params:${JSON.stringify(params)}`, APP);

    return this.salesService.fetchAllSalesPartnersByDate(params)
  }

  @Patch(':id')
  updateSalesPartner(@Param('id') id: string, @Body() updateSalesPartnerDto: UpdateSalesPartner) {
    Logger.debug(`updateSalesPartner() id: [${id}] updateSalesPartnerDto :${JSON.stringify(updateSalesPartnerDto,)}`, APP);

    return this.salesService.updateSalesPartner(id, updateSalesPartnerDto);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      _destination: STATIC_IMAGES_PROFILE,
      get destination() {
        return this._destination;
      },
      set destination(value) {
        this._destination = value;
      },
      filename: editFileName
    }),
    fileFilter: imageFileFilter
  }))

  async uploadImage(@Param('id') id: string, @UploadedFile() file) {
    Logger.debug(`UploadImage: ${file}`, APP);

    return this.salesService.uploadImage(id, file.filename);
  }

  @Patch(':id/update-customer')
  updateUserIdInSales(@Param('id') id: string, @Body() updateSalesPartnerDto: UpdateSalesPartner) {
    Logger.debug(`updateUserIdInSales() id: [${id}] DTO:${JSON.stringify(updateSalesPartnerDto,)}`, APP);

    return this.salesService.updateUserIdInSales(id, updateSalesPartnerDto);
  }

  @Get(':salesCode/earning')
  fetchEarnings(@Param('salesCode') salesCode: string, @Query() period: Period) {
    Logger.debug(`fetchEarnings()salesCode: [${salesCode}] `, APP);

    return this.salesCommissionService.fetchEarnings(salesCode, period);
  }

  @Get(':salesCode/invatation-response')
  fetchInvitationResponse(@Param('salesCode') salesCode: string, @Query() period: Period) {
    Logger.debug(`fetchInvitationResponse()salesCode: [${salesCode}] `, APP);

    return this.salesCommissionService.fetchInvitationResponse(salesCode, period);
  }

  @Patch('bank-details-verification/:id')
  changeBankDetailsVerificationStatus(@Param('id', ParseIntPipe) id: number) {
    Logger.debug(`changeBankDetailsVerificationStatus() id:[${id}] `, APP);

    return this.salesCommissionService.changeBankDetailsVerificationStatus(id);
  }


  @Get(':salesCode/earning-report/:year')
  fetchEarnigReport(@Param() yearMonthDto: YearMonthDto) {
    Logger.debug(`fetchEarnigReport() year: [${yearMonthDto.year}`, APP);

    return this.salesCommissionService.fetchEarnigReport(yearMonthDto);
  }
}
