import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { TemplateService } from 'src/constants/template.service';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'sales_commission_junction'}),
    DatabaseModule.forFeature({ tableName: 'sales_partner'}),
    DatabaseModule.forFeature({ tableName: 'sales_partner_requests'}),
    DatabaseModule.forFeature({ tableName: 'sales_user_junction'}),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
  ],
  controllers: [AdminController],
  providers: [AdminService, TemplateService],
  exports:[AdminService]
})
export class AdminModule {}
