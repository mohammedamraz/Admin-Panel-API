import { Module } from '@nestjs/common';
import { IndividualUserService } from './individual-user.service';
import { IndividualUserController } from './individual-user.controller';
import { AdminService } from '../admin/admin.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { TemplateService } from 'src/constants/template.service';
import { HttpModule } from '@nestjs/axios/dist';
import { SendEmailService } from 'src/send-email/send-email.service';

@Module({

    imports: [
    DatabaseModule.forFeature({ tableName: 'sales_commission_junction'}),
    DatabaseModule.forFeature({ tableName: 'sales_partner'}),
    DatabaseModule.forFeature({ tableName: 'sales_partner_requests'}),
    DatabaseModule.forFeature({ tableName: 'sales_user_junction'}),
    DatabaseModule.forFeature({ tableName: 'individual_user'}),
    
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
  ],
  controllers: [IndividualUserController],
  providers: [IndividualUserService,AdminService,TemplateService,SendEmailService]
})
export class IndividualUserModule {}
