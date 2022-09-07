import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { ProductService } from 'src/routes/product/product.service';
import { UserProductJunctionService } from 'src/routes/user-product-junction/user-product-junction.service';
import { VideoToVitalsService } from 'src/routes/video-to-vitals/video-to-vitals.service';
import { SendEmailService } from 'src/send-email/send-email.service';
import { ProfileInfoController } from './profile-info.controller';
import { ProfileInfoService } from './profile-info.service';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'user_profile_info' }),
    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'organization' }),
    DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),
    DatabaseModule.forFeature({ tableName: 'product' }),
    DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })]
,  controllers: [ProfileInfoController],
  providers: [ProfileInfoService,VideoToVitalsService,ProductService, UserProductJunctionService, SendEmailService, TemplateService]
})
export class ProfileInfoModule {}
