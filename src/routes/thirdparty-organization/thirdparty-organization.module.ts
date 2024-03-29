import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TemplateService } from 'src/constants/template.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
// import { SendEmailService } from 'src/send-email/send-email.service';
import { ProductService } from '../product/product.service';
import { SendEmailService } from '../send-email/send-email.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { OrganizationService } from '../video-to-vitals/organization.service';
import { UsersService } from '../video-to-vitals/users.service';
import { ThirdpartyOrganizationController } from './thirdparty-organization.controller';
import { ThirdpartyOrganizationService } from './thirdparty-organization.service';

@Module({
    imports: [DatabaseModule.forFeature({ tableName: 'third_party_organization' }),
    DatabaseModule.forFeature({ tableName: 'third_party_organization_junction' }),
    DatabaseModule.forFeature({ tableName: 'organization' }),
    DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),
    DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'user_profile_info' }),
    DatabaseModule.forFeature({ tableName: 'product' }),
    DatabaseModule.forFeature({ tableName: 'product_tests' }),







    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })

],
  controllers: [ThirdpartyOrganizationController],
  providers: [ThirdpartyOrganizationService,UsersService,OrganizationService,ProductService,UserProductJunctionService,SendEmailService,TemplateService,OrgProductJunctionService],
  exports:[ThirdpartyOrganizationService]
})
export class ThirdpartyOrganizationModule {}
