import { Module } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { VideoToVitalsController } from './video-to-vitals.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { SendEmailService } from 'src/send-email/send-email.service';
import { TemplateService } from 'src/constants/template.service';
import { HttpModule, HttpService } from '@nestjs/axios';
// import { HttpModule } from '@nestjs/axios';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'organization' }),
    DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),

    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'user_profile_info' }),

    DatabaseModule.forFeature({ tableName: 'product' }),
    DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
  ],
  controllers: [VideoToVitalsController],
  providers: [VideoToVitalsService, ProductService, UserProductJunctionService, SendEmailService, TemplateService, OrganizationService ],
  exports: [OrganizationService]
})
export class VideoToVitalsModule { }
