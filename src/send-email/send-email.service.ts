import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { sendEmailOnCreationOfDirectSalesPartner } from 'src/routes/admin/dto/create-admin.dto';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
const APP = "SendEmailService"
@Injectable()
export class SendEmailService {

  constructor(
    private readonly templateService: TemplateService,
  ) {}

  sendEmailOnCreateOrg(body: sendEmailOnCreationOfDirectSalesPartner){
    Logger.debug(`sendEmailOnCreateOrg() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnOrgCreation(body)
  }

  sendEmailOnCreateOrgUser(body: sendEmailOnCreationOfDirectSalesPartner){
    Logger.debug(`sendEmailOnCreateOrgUser() body: [${JSON.stringify(body)}]`, APP);

    return this.templateService.sendEmailOnCreateOrgUser(body)
  }


}
