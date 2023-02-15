import { Body, Controller, Logger, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @Post('logout/inactive/notification')
    sendEmailOnOrgAdminInactiveAndLoggedOut(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailOnOrgAdminInactiveAndLoggedOut() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnOrgAdminInactiveAndLoggedOut(body)
    }

    @Post('signup/org/email')
    sendEmailOnceOrgIsCreated(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailOnceOrgIsCreated() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnceOrgIsCreated(body)
    }

    @Post('resend/email/user')
    ResendInvitationEmailForUser(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`ResendInvitationEmailForUser() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.ResendInvitationEmailForUser(body)
    }

    @Post('resend/email/org')
    ResendInvitationEmailForOrg(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`ResendInvitationEmailForOrg() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.ResendInvitationEmailForOrg(body)
    }

    @Post('signup/user/email')
    sendEmailOnceUserIsCreated(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailOnceUserIsCreated() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailOnceUserIsCreated(body)
    }

    @Post('email/user/active')
    SendEmailOnceUserIsBackActive(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`SendEmailOnceUserIsBackActive() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.SendEmailOnceUserIsBackActive(body)
    }

    @Post('email/org/active')
    SendEmailOnceOrgIsBackActive(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`SendEmailOnceOrgIsBackActive() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.SendEmailOnceOrgIsBackActive(body)
    }
    
    @Post('web/org/fedo')
  @UseInterceptors(FileInterceptor('file'))
  sendEmailToFedoOnceOrgCreatedInWeb(@Body() body:sendEmailOnCreationOfDirectSalesPartner) {
      Logger.debug(`sendEmailToFedoOnceOrgCreatedInWeb() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendEmailToFedoOnceOrgCreatedInWeb(body)
    }
    
    @Post('web/org/second')
  @UseInterceptors(FileInterceptor('file'))
  sendInstructionEmailOnOrgCreationOnWeb(@Body() body:sendEmailOnCreationOfOrgAndUser) {
      Logger.debug(`sendInstructionEmailOnOrgCreationOnWeb() body: [${JSON.stringify(body)}]`, APP);
  
      return this.sendEmailService.sendInstructionEmailOnOrgCreationOnWeb(body)
    }
}
