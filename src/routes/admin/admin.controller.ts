import { Controller, Get, Post, Body, Param, Logger, Query, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'src/interceptors/interceptor';
import { Period } from '../sales/dto/create-sale.dto';
import { AdminService } from './admin.service';
import { createPaid, DateDTO, MobileDtO, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto, YearMonthDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO, PeriodRange, State } from './dto/login.dto';

const APP = 'AdminController';
@Controller()
@UseInterceptors(LoggingInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

 

  @Post()
  sentOtpToPhoneNumber(@Body() mobileNumberDtO: MobileNumberDtO) {
   Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.adminService.sentOtpToPhoneNumber(mobileNumberDtO);
  }

  @Post('download-link')
  sentFedoAppDownloadLinkToMobileAndWhatsappNumber(@Body() mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sentFedoAppDownloadLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.adminService.sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO);
  }

  @Post('login') 
  login(@Body() Logindto: LoginDTO) {
    Logger.debug(`login() UserLoginDTO:[${JSON.stringify(Logindto)}]`);

    return this.adminService.login(Logindto);
  }

  @Post('password')
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    Logger.debug(`forgotPassword() forgotPasswordDTO:[${JSON.stringify(forgotPasswordDTO,)}]`,);

    return this.adminService.forgotPassword(forgotPasswordDTO);
  }

  @Post('password/otp')
  confirmForgotPassword(@Body() confirmForgotPasswordDTO: ConfirmForgotPasswordDTO,) {
    Logger.debug(`confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(confirmForgotPasswordDTO,)}]`,);

    return this.adminService.confirmForgotPassword(confirmForgotPasswordDTO);
  }

  @Post('send-email/:mobileNumber')
  sendEmailOnIncorrectBankDetails(@Body() body: requestDto, @Param() param: ParamDto) {
    Logger.debug(`sendEmailOnIncorrectBankDetails() body: [${JSON.stringify(body)}] param: [${JSON.stringify(param)}] `, APP);

    return this.adminService.sendEmailOnIncorrectBankDetails(body, param);
  }

  @Post("payment-record")
  updatePaidAmount(@Body() updateAmountdto:createPaid) {
    Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);

    return this.adminService.updatePaidAmount(updateAmountdto)
  }

  @Post('sales-link')
  sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(@Body() mobileNumberDtO: MobileDtO) {
    Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.adminService.sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO);
  }

  @Post('notification')
  sendNotificationToSalesPartnerOnMobileAndWhatsappNumber(@Body() mobileNumberDtO: MobileDtO) {
    Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.adminService.sendNotificationToSalesPartnerOnMobileAndWhatsappNumber(mobileNumberDtO);
  }

  @Get('sales-partner')
  fetchSalesPartner(@Query() period: Period) {
    Logger.debug(`fetchSalesPartner() period: [${JSON.stringify(period)}]`, APP);

    return this.adminService.fetchSalesPartner(period);
  }

  @Get('commission-report/:year')
  fetchCommissionReport(@Param() yearMonthDto:YearMonthDto){
    Logger.debug(`fetchCommissionReport() yearMonthDto: [${yearMonthDto.year}]`, APP);

    return this.adminService.fetchCommissionReport(yearMonthDto);
  }

  @Get('monthly-report/:year/:month')
  fetchMonthlyReport(@Param() dateDTO: DateDTO){
    Logger.debug(`fetchMonthlyReport() dateDTO: [${JSON.stringify(dateDTO)}]`, APP);

    return this.adminService.fetchMonthlyReport(dateDTO);

  }

  @Get('sales/account-details')
  fetchSalesPartnerAccountDetails() {
   Logger.debug(`getSalesPartnerAccountDetails()`, APP);

    return this.adminService.fetchSalesPartnerAccountDetails()
  }

  @Get('commission-dispersals')
  fetchCommissionDispersals(@Query() period: PeriodRange) {
      Logger.debug(`fetchCommissionDispersals() period: [${JSON.stringify(period.period)}]`, APP);

      return this.adminService.fetchCommissionDispersals(period);
  }

  @Get('invitation-responses')
  fetchInvitationResponses(@Query() state: State) {
    Logger.debug(`fetchInvitationResponses() state: [${JSON.stringify(state)}]`, APP);

    return this.adminService.fetchInvitationResponse(state);
  }

  @Get('sales/account-details/:salesCode')
  fetchSalesPartnerAccountDetailsBySalesCode(@Param('salesCode') salesCode: string) {
   Logger.debug(`fetchSalesPartnerAccountDetailsByID()`, APP);

    return this.adminService.fetchSalesPartnerAccountDetailsBySalesCode(salesCode)
  }

  @Get(':phoneNumber/:otp')
  verifyOtp(@Param() mobileNumberAndOtpDtO: MobileNumberAndOtpDtO) {
    Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);

    return this.adminService.verifyOtp(mobileNumberAndOtpDtO);
  }
}
