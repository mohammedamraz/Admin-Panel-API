import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';
import { createPaid, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO } from './dto/login.dto';

const APP = 'AdminController';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('commission-report/:sales_code/:year')
  fetchCommissionReport(@Param('sales_code') sales_code:string, @Param('year') year:number){
    Logger.debug(`fetchCommissionReport() year: [${year}] sales_code: [${sales_code}]`, APP);

    return this.adminService.fetchCommissionReport(sales_code, year);
  }

  @Get('sales/account-details')
  fetchSalesPartnerAccountDetails() {
   Logger.debug(`getSalesPartnerAccountDetails()`, APP);

    return this.adminService.fetchSalesPartnerAccountDetails()
  }

  @Get('sales/account-details/:sales_code')
  fetchSalesPartnerAccountDetailsBySalesCode(@Param('sales_code') sales_code: string) {
   Logger.debug(`fetchSalesPartnerAccountDetailsByID()`, APP);

    return this.adminService.fetchSalesPartnerAccountDetailsBySalesCode(sales_code)
  }

  @Post()
  sentOtpToPhoneNumber(@Body() mobileNumberDtO: MobileNumberDtO) {
   Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.adminService.sentOtpToPhoneNumber(mobileNumberDtO);
  }

  @Get(':phoneNumber/:otp')
  verifyOtp(@Param() mobileNumberAndOtpDtO: MobileNumberAndOtpDtO) {
    Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);

    return this.adminService.verifyOtp(mobileNumberAndOtpDtO);
  }

  @Post('/download-link')
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

  @Post('/send-email/:mobileNumber')
  sendEmailOnIncorrectBankDetails(@Body() body: requestDto, @Param() param: ParamDto) {
    Logger.debug(`sendEmailOnIncorrectBankDetails() body: [${JSON.stringify(body)}] param: [${JSON.stringify(param)}] `, APP);

    return this.adminService.sendEmailOnIncorrectBankDetails(body, param);
  }

  @Post("payment-record")
  updatingPaidAmount(@Body() updateAmountdto:createPaid) {
    Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);

    return this.adminService.updatingPaidAmount(updateAmountdto)
  }

  @Post('/sales-link')
  sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(@Body() mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.adminService.sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO);
  }

 

}
