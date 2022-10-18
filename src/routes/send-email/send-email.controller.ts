import { Body, Controller, Logger, Post } from '@nestjs/common';
import { sendEmailOnCreationOfDirectSalesPartner, sendEmailOnCreationOfOrgAndUser } from '../admin/dto/create-admin.dto';
import { SendEmailService } from './send-email.service';

const APP = "SendEmailController"
@Controller()
export class SendEmailController {

    constructor(
        private readonly sendEmailService: SendEmailService,
      ) {}

    @Post('org/webAccess')
    sendEmailOnVitalsWebAppAccess(@Body() body:sendEmailOnCreationOfOrgAndUser) {
      Logger.debug(`sendEmailOnVitalsWebAppAccess() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnVitalsWebAppAccess(body)
    }

    @Post('pilotExpire')
    sendEmailOnPilotExpire(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailOnPilotExpire() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnPilotExpire(body)
    }

    @Post('org/invalid')
    sendEmailOnNotAbleToIdentifyOrganisation(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailOnNotAbleToIdentifyOrganisation() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnNotAbleToIdentifyOrganisation(body)
    }

    @Post('logout/notification')
    sendEmailOnOrgAdminExpiredAndLoggedOut(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailOnOrgAdminExpiredAndLoggedOut() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnOrgAdminExpiredAndLoggedOut(body)
    }

}
