import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { PasswordResetDTO, sendEmailOnCreationOfDirectSalesPartner } from 'src/routes/admin/dto/create-admin.dto';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
import {  sendEmailOnCreationOfOrgAndUser } from 'src/routes/admin/dto/create-admin.dto';
import { EmailOtpDto } from 'src/routes/individual-user/dto/create-individual-user.dto';

const APP = "SendEmailService"
@Injectable()
export class SendEmailService {

  constructor(
    private readonly templateService: TemplateService,
  ) {}

  sendEmailOnCreateOrg(body: sendEmailOnCreationOfOrgAndUser){
    Logger.debug(`sendEmailOnCreateOrg() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnOrgCreation(body)
  }

  sendEmailOnCreateOrgUser(body: sendEmailOnCreationOfOrgAndUser){
    Logger.debug(`sendEmailOnCreateOrgUser() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnCreateOrgUser(body)
  }

  sendEmailOnPilotExpire(body: sendEmailOnCreationOfDirectSalesPartner){
    Logger.debug(`sendEmailOnPilotExpire() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnPilotExpire(body)
  }

  sendEmailOnNotAbleToIdentifyOrganisation(body: sendEmailOnCreationOfDirectSalesPartner){
    Logger.debug(`sendEmailOnNotAbleToIdentifyOrganisation() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnNotAbleToIdentifyOrganisation(body)
  }

  sendEmailToIncreaseTestsForIndividuals(body: sendEmailOnCreationOfDirectSalesPartner){
    Logger.debug(`sendEmailToIncreaseTestsForIndividuals() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToIncreaseTestsForIndividuals(body)
  } 

  sendEmailToResetUsersPassword(body: PasswordResetDTO){
    Logger.debug(`sendEmailToResetUsersPassword() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToResetUsersPassword(body)
  }

  sendOtpToEmail(emailAndOtp: EmailOtpDto){
    Logger.debug(`sendOtpToEmail() body: [${JSON.stringify(emailAndOtp)}]`, APP);

    return this.templateService.sendOtpToEmail(emailAndOtp);
  }


}
