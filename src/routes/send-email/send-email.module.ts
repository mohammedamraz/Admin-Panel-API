import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { TemplateService } from 'src/constants/template.service';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { UsersService } from '../video-to-vitals/users.service';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { VideoToVitalsService } from '../video-to-vitals/video-to-vitals.service';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { OrganizationService } from '../video-to-vitals/organization.service';
import { HttpModule } from '@nestjs/axios';

@Module({
imports:[
  DatabaseModule.forFeature({ tableName: 'product_tests' }),
  DatabaseModule.forFeature({ tableName: 'organization' }),
  DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),
  DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
  DatabaseModule.forFeature({ tableName: 'users' }),
  DatabaseModule.forFeature({ tableName: 'user_profile_info' }),
  DatabaseModule.forFeature({ tableName: 'product' }),
  HttpModule.register({
    timeout: 10000,
    maxRedirects: 5
  })
],
  controllers: [SendEmailController],
  providers: [SendEmailService,TemplateService,ProductTestsService,UsersService,ProductService,UserProductJunctionService,VideoToVitalsService,  OrganizationService, OrgProductJunctionService,],
  exports:[SendEmailService]
})
export class SendEmailModule {}
