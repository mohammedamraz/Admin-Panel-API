import { Body, Controller, Logger, Post } from '@nestjs/common';
import { sendEmailOnCreationOfOrgAndUser } from '../admin/dto/create-admin.dto';
import { SendEmailService } from './send-email.service';

const APP = "SendEmailController"
@Controller()
export class SendEmailController {

    constructor(
        private readonly sendEmailService: SendEmailService,
      ) {}

    // @Post("payment-record")
    // updatePaidAmount(@Body() updateAmountdto:sendEmailOnCreationOfOrgAndUser) {
    //   Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);
  
    //   return this.templateService.sendEmailOnVitalsWebAppAccess(updateAmountdto)
    // }


}
