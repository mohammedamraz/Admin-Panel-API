import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
const APP = "SendEmailController"
@Controller()
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @Post('send_email')
  sendEmailOnCreateOrg(@Body() createSendEmailDto: CreateSendEmailDto) {
    Logger.debug(`sendEmailOnIncorrectBankDetails() createSendEmailDto: [${JSON.stringify(createSendEmailDto)}] `, APP);

    return this.sendEmailService.sendEmailOnCreateOrg(createSendEmailDto);
  }

}
