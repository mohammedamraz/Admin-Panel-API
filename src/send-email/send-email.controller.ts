import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
import { sendEmailOnCreationOfDirectSalesPartner } from 'src/routes/admin/dto/create-admin.dto';
const APP = "SendEmailController"
@Controller()
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post('send_email')
  sendEmailOnCreateOrg(@Body() createSendEmailDto: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnCreateOrg() createSendEmailDto: [${JSON.stringify(createSendEmailDto)}] `, APP);

    return this.sendEmailService.sendEmailOnCreateOrg(createSendEmailDto);
  }

  @Post('send_email/user')
  sendEmailOnCreateOrgUser(@Body() createSendEmailDto: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnCreateOrgUser() createSendEmailDto: [${JSON.stringify(createSendEmailDto)}] `, APP);

    return this.sendEmailService.sendEmailOnCreateOrgUser(createSendEmailDto);
  }

}
