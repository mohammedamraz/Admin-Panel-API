import { Injectable } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';

@Injectable()
export class SendEmailService {

  constructor(
    private readonly templateService: TemplateService,
  ) {}
 sendEmailOnCreateOrg(createSendEmailDto: CreateSendEmailDto){
 return "akash";
 }
}
