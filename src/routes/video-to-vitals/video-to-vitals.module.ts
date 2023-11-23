import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { VideoToVitalsController } from './video-to-vitals.controller';
import { VideoToVitalsService } from './video-to-vitals.service';
// import { HttpModule } from '@nestjs/axios';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';
import { SendEmailService } from '../send-email/send-email.service';
import { OrganizationService } from './organization.service';
import { UsersService } from './users.service';

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
    DatabaseModule.forFeature({ tableName: 'test_status' }),
    
  
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
