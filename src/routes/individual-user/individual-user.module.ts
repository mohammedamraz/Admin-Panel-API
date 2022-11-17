import { Module } from '@nestjs/common';
import { IndividualUserService } from './individual-user.service';
import { IndividualUserController } from './individual-user.controller';
import { AdminService } from '../admin/admin.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { TemplateService } from 'src/constants/template.service';
import { HttpModule } from '@nestjs/axios/dist';
import { SendEmailService } from '../send-email/send-email.service';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';
import { UsersService } from '../video-to-vitals/users.service';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';

@Module({

    imports: [
    DatabaseModule.forFeature({ tableName: 'sales_commission_junction'}),
    DatabaseModule.forFeature({ tableName: 'sales_partner'}),
    DatabaseModule.forFeature({ tableName: 'sales_partner_requests'}),
    DatabaseModule.forFeature({ tableName: 'sales_user_junction'}),
    DatabaseModule.forFeature({ tableName: 'individual_user'}),
    DatabaseModule.forFeature({ tableName: 'product_tests'}),
    DatabaseModule.forFeature({ tableName: 'organization'}),
    DatabaseModule.forFeature({ tableName: 'organization_product_junction'}),
    DatabaseModule.forFeature({ tableName: 'user_product_junction'}),
    DatabaseModule.forFeature({ tableName: 'users'}),
    DatabaseModule.forFeature({ tableName: 'user_profile_info'}),
    DatabaseModule.forFeature({ tableName: 'product'}),
    DatabaseModule.forFeature({ tableName: 'individual_user_reference_junction'}),
    
    
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })
  ],
  controllers: [IndividualUserController],
  providers: [IndividualUserService,ProductTestsService,AdminService,TemplateService,SendEmailService,UsersService,ProductService,UserProductJunctionService]
})
export class IndividualUserModule {}
