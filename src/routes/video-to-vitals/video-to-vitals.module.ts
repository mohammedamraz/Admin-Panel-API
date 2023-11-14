import { Module } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { VideoToVitalsController } from './video-to-vitals.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { TemplateService } from 'src/constants/template.service';
import { HttpModule, HttpService } from '@nestjs/axios';
// import { HttpModule } from '@nestjs/axios';
import { OrganizationService } from './organization.service';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { SendEmailService } from '../send-email/send-email.service';
import { UsersService } from './users.service';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'organization' }),
    DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),

    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'user_profile_info' }),

    DatabaseModule.forFeature({ tableName: 'product' }),
    DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
    DatabaseModule.forFeature({ tableName: 'vitals_table' }),
    DatabaseModule.forFeature({ tableName: 'product_tests' }),
    
  
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
  ],
  controllers: [VideoToVitalsController],
  providers: [VideoToVitalsService, ProductService, UserProductJunctionService, SendEmailService, TemplateService, OrganizationService, OrgProductJunctionService, UsersService ,ProductTestsService],
  exports: [OrganizationService]
})
export class VideoToVitalsModule { }
