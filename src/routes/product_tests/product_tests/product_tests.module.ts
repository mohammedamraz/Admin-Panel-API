import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { OrgProductJunctionService } from 'src/routes/org-product-junction/org-product-junction.service';
import { ProductService } from 'src/routes/product/product.service';
import { SendEmailService } from 'src/routes/send-email/send-email.service';
import { UserProductJunctionService } from 'src/routes/user-product-junction/user-product-junction.service';
import { OrganizationService } from 'src/routes/video-to-vitals/organization.service';
import { UsersService } from 'src/routes/video-to-vitals/users.service';
import { VideoToVitalsService } from 'src/routes/video-to-vitals/video-to-vitals.service';
import { ProductTestsController } from './product_tests.controller';
import { ProductTestsService } from './product_tests.service';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'product_tests' }),
    DatabaseModule.forFeature({ tableName: 'organization' }),
    DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),
    DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'user_profile_info' }),
    DatabaseModule.forFeature({ tableName: 'product' }),
    DatabaseModule.forFeature({ tableName: 'test_status' }),

    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
    ],
  controllers: [ProductTestsController],
  providers: [ProductTestsService,UsersService,ProductService,UserProductJunctionService,SendEmailService,TemplateService,VideoToVitalsService,OrganizationService,OrgProductJunctionService]
})
export class ProductTestsModule {}
