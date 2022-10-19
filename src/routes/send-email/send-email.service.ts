import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { PasswordResetDTO, sendEmailOnCreationOfDirectSalesPartner } from 'src/routes/admin/dto/create-admin.dto';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
import { sendEmailOnCreationOfOrgAndUser } from 'src/routes/admin/dto/create-admin.dto';
import { EmailOtpDto } from 'src/routes/individual-user/dto/create-individual-user.dto';
import { encryptPassword } from 'src/constants/helper';

const APP = "SendEmailService"
@Injectable()
export class SendEmailService {

  constructor(
    private readonly templateService: TemplateService,
  ) { }

  sendEmailOnCreateOrg(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnCreateOrg() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnOrgCreation(body)
  }

  sendEmailOnCreateOrgUser(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnCreateOrgUser() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnCreateOrgUser(body)
  }

  sendEmailOnPilotExpire(body: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnPilotExpire() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnPilotExpire(body)
  }

  sendEmailOnNotAbleToIdentifyOrganisation(body: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnNotAbleToIdentifyOrganisation() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnNotAbleToIdentifyOrganisation(body)
  }


  sendEmailOnOrgAdminExpiredAndLoggedOut(body: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnOrgAdminExpiredAndLoggedOut() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnOrgAdminExpiredAndLoggedOut(body)
  }

  sendEmailOnceOrgIsCreated(body: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnceOrgIsCreated() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnceOrgIsCreated(body)
  }

  sendEmailOnceUserIsCreated(body: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailOnceUserIsCreated() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnceUserIsCreated(body)
  }

  sendEmailToIncreaseTestsForIndividuals(body: sendEmailOnCreationOfDirectSalesPartner) {
    Logger.debug(`sendEmailToIncreaseTestsForIndividuals() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToIncreaseTestsForIndividuals(body)
  }

  sendEmailToResetUsersPassword(body: PasswordResetDTO) {
    Logger.debug(`sendEmailToResetUsersPassword() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToResetUsersPassword(body)
  }

  sendOtpToEmail(emailAndOtp: EmailOtpDto) {
    Logger.debug(`sendOtpToEmail() body: [${JSON.stringify(emailAndOtp)}]`, APP);

    return this.templateService.sendOtpToEmail(emailAndOtp);
  }

  sendEmailOnVitalsWebAppAccess(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnVitalsWebAppAccess() body: [${JSON.stringify(body)}]`, APP);

    body.url = "https://www.fedo.ai/products/" + body.url.replace('_', '/') +'?'+ encodeURIComponent(encryptPassword(JSON.stringify({ org_junction_id: body.org_junction_id })))
    return this.templateService.sendEmailOnVitalsWebAppAccess(body)
  }


}
