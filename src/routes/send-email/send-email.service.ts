import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { PasswordResetDTO, sendEmailOnCreationOfDirectSalesPartner } from 'src/routes/admin/dto/create-admin.dto';
import { CreateSendEmailDto, format_mobilesave } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
import { sendEmailOnCreationOfOrgAndUser } from 'src/routes/admin/dto/create-admin.dto';
import { EmailOtpDto } from 'src/routes/individual-user/dto/create-individual-user.dto';
import { encryptPassword } from 'src/constants/helper';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { ProductTestsDto } from '../product_tests/product_tests/dto/create-product_tests.dto';

const APP = "SendEmailService"
@Injectable()
export class SendEmailService {

  constructor(
    @DatabaseTable('product_tests')
        private readonly productTestDB: DatabaseService<ProductTestsDto>,
    private readonly templateService: TemplateService,
    // private readonly prod : ProductTestsService
  ) { }

  sendEmailOnCreateOrg(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnCreateOrg() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnOrgCreation(body)
  }

  sendEmailOnCreateOrgUser(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnCreateOrgUser() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnCreateOrgUser(body)
  }

  sendEmailOnPilotExpire(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnPilotExpire() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnPilotExpire(body)
  }

  sendEmailOnNotAbleToIdentifyOrganisation(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnNotAbleToIdentifyOrganisation() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnNotAbleToIdentifyOrganisation(body)
  }


  sendEmailOnOrgAdminExpiredAndLoggedOut(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnOrgAdminExpiredAndLoggedOut() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnOrgAdminExpiredAndLoggedOut(body)
  }

  sendEmailOnOrgAdminInactiveAndLoggedOut(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnOrgAdminInactiveAndLoggedOut() body: [${JSON.stringify(body)}]`, APP);

    body.expired_date = new Date().toISOString().split("T")[0]
    return this.templateService.sendEmailOnOrgAdminInactiveAndLoggedOut(body)
  }

  sendEmailOnceOrgIsCreated(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnceOrgIsCreated() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnceOrgIsCreated(body)
  }

  sendEmailOnceUserIsCreated(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnceUserIsCreated() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnceUserIsCreated(body)
  }

  SendEmailOnceUserIsBackActive(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`SendEmailOnceUserIsBackActive() body: [${JSON.stringify(body)}]`, APP);

    body.name = body.name.split(' ')[0]
    return this.templateService.SendEmailOnceUserIsBackActive(body)
  }

  SendEmailOnceOrgIsBackActive(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`SendEmailOnceOrgIsBackActive() body: [${JSON.stringify(body)}]`, APP);

    body.organisation_admin_name = body.organisation_admin_name.split(' ')[0]
    return this.templateService.SendEmailOnceOrgIsBackActive(body)
  }

  ResendInvitationEmailForOrg(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`ResendInvitationEmailForOrg() body: [${JSON.stringify(body)}]`, APP);

    var encryption = { org_id: body.org_id }
    body.organisation_admin_name = body.organisation_admin_name.split(' ')[0]
    body.url = "https://fedo.ai/admin/vital/" + body.url + "?" + encodeURIComponent(encryptPassword(encryption))
    body.fedo_app = "Fedo Vitals"
    return this.templateService.sendEmailOnOrgCreation(body)
  }

  ResendInvitationEmailForUser(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`ResendInvitationEmailForUser() body: [${JSON.stringify(body)}]`, APP);

    var encryption = { user_id: body.user_id }
    body.name = body.name.split(' ')[0]
    body.url = "https://fedo.ai/admin/vital/" + body.url + "?" + encodeURIComponent(encryptPassword(encryption))
    body.fedo_app = "Fedo Vitals"
    // body.organisation_name = "Fedo"
    return this.templateService.sendEmailOnCreateOrgUser(body)
  }

  sendEmailToIncreaseTestsForIndividuals(body: sendEmailOnCreationOfOrgAndUser) {
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

    body.url = "https://fedo.ai/products/" + body.url.replace('_', '/') +'?'+ encodeURIComponent(encryptPassword(JSON.stringify({ org_junction_id: body.org_junction_id })))
    return this.templateService.sendEmailOnVitalsWebAppAccess(body)
  }

  sendFinalEmailOncePilotIsExpired(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendFinalEmailOncePilotIsExpired() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendFinalEmailOncePilotIsExpired(body)
  }

  sendFinalEmailWhenDaysLeftToPilotExpire(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendFinalEmailWhenDaysLeftToPilotExpire() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendFinalEmailWhenDaysLeftToPilotExpire(body)
  }

  sendEmailToFedoOnceOrgCreatedInWeb(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailToFedoOnceOrgCreatedInWeb() body: [${JSON.stringify(body)}]`, APP);

    // body.fedo_app = "Fedo Vitals";
    return this.templateService.sendEmailToFedoOnceOrgCreatedInWeb(body)
  }

  sendInstructionEmailOnOrgCreationOnWeb(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendInstructionEmailOnOrgCreationOnWeb() body: [${JSON.stringify(body)}]`, APP);

    // body.url = "https://www.fedo.ai/products/" + body.url.replace('_', '/') +'?'+ encodeURIComponent(encryptPassword(JSON.stringify({ org_junction_id: body.org_junction_id })))
    return this.templateService.sendInstructionEmailOnOrgCreationOnWeb(body)
  }

  sendEmailToFedoOnVitalsBatchProcessFailed(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailToFedoOnVitalsBatchProcessFailed() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToFedoOnVitalsBatchProcessFailed(body)
  }

  sendEmailToFedoAndPilotOnVitalsAPIProcessFailed(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailToFedoAndPilotOnVitalsAPIProcessFailed() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToFedoAndPilotOnVitalsAPIProcessFailed(body)
  }

  sendEmailToFedoAndPilotOnDataPurge(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailToFedoAndPilotOnDataPurge() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailToFedoAndPilotOnDataPurge(body)
  }

  sendEmailWithPDFAttached(toAddresses: any, file :any) {
    Logger.debug(`sendEmailToFedoAndPilotOnVitalsAPIProcessFailed() body: [${JSON.stringify(toAddresses)}]`, APP);

    file.toAddress = toAddresses.body
    return this.templateService.sendEmail(toAddresses, file)
  }
  async sendEmailWithVitalsData(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailWithVitalsData() body: [${JSON.stringify(body)}]`, APP);

    var currentdate = new Date();
    var datetime = currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    const doc = await this.templateService.sendEmailWithVitalsData(body);
    return this.productTestDB.findandUpdate({ columnName: 'vitals_id', columnvalue: body.scan_id, quries: format_mobilesave(doc,body.organisation_admin_mobile,datetime) });
  }

  async savePdfWithVitalsData(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`savePdfWithVitalsData() body: [${JSON.stringify(body)}]`, APP);

    var currentdate = new Date();
    var datetime = currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    const doc = await this.templateService.savePdfWithVitalsData(body);
    return this.productTestDB.findandUpdate({ columnName: 'vitals_id', columnvalue: body.scan_id, quries: format_mobilesave(doc,body.organisation_admin_mobile,datetime) });
  }

  async savePdfWithVitalsDataInGcp(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`savePdfWithVitalsDataInGcp() body: [${JSON.stringify(body)}]`, APP);

    var currentdate = new Date();
    var datetime = currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    const doc = await this.templateService.savePdfWithVitalsDataInGcp(body);
    return this.productTestDB.findandUpdate({ columnName: 'vitals_id', columnvalue: body.scan_id, quries: format_mobilesave(doc,body.organisation_admin_mobile,datetime) });
  }

  async sendEmailToKioskUserWithVitalsData(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailToKioskUserWithVitalsData() body: [${JSON.stringify(body)}]`, APP);

    const doc = await this.templateService.sendEmailToKioskUserWithVitalsData(body);
    // return this.productTestDB.findandUpdate({ columnName: 'vitals_id', columnvalue: body.scan_id, quries: { pdf_location: doc } });
  }

  sendEmailOnWebSocketFailure(body: sendEmailOnCreationOfOrgAndUser) {
    Logger.debug(`sendEmailOnWebSocketFailure() body: [${JSON.stringify(body)}]`, APP);

    // body.fedo_app = "Fedo Vitals";
    return this.templateService.sendEmailOnWebSocketFailure(body)
  }

}
