import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { ProductService } from '../product/product.service';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { OrganizationService } from '../video-to-vitals/organization.service';
import { UsersService } from '../video-to-vitals/users.service';
import { VideoToVitalsService } from '../video-to-vitals/video-to-vitals.service';
import { SendEmailController } from './send-email.controller';
import { SendEmailService } from './send-email.service';

@Module({
imports:[
  DatabaseModule.forFeature({ tableName: 'product_tests' }),
  DatabaseModule.forFeature({ tableName: 'organization' }),
  DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),
  DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
  DatabaseModule.forFeature({ tableName: 'users' }),
  DatabaseModule.forFeature({ tableName: 'user_profile_info' }),
  DatabaseModule.forFeature({ tableName: 'product' }),
  DatabaseModule.forFeature({ tableName: 'vitals_table' }),
  DatabaseModule.forFeature({ tableName: 'test_status' }),

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
