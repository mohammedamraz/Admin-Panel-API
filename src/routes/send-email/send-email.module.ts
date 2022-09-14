import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { TemplateService } from 'src/constants/template.service';

@Module({

  controllers: [SendEmailController],
  providers: [SendEmailService,TemplateService],
  exports:[SendEmailService]
})
export class SendEmailModule {}
