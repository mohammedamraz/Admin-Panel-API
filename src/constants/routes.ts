import { AdminModule } from 'src/routes/admin/admin.module';
import { IndividualUserModule } from 'src/routes/individual-user/individual-user.module';
import { ProductModule } from 'src/routes/product/product.module';
import { ProfileInfoModule } from 'src/routes/profile-info/profile-info/profile-info.module';
import { SalesModule } from 'src/routes/sales/sales.module';
import { ThirdpartyOrganizationModule } from 'src/routes/thirdparty-organization/thirdparty-organization.module';
import { SendEmailModule } from 'src/routes/send-email/send-email.module';
import { UserProductJunctionModule } from 'src/routes/user-product-junction/user-product-junction.module';
import { VideoToVitalsModule } from 'src/routes/video-to-vitals/video-to-vitals.module';
import { OrgProductJunctionModule } from 'src/routes/org-product-junction/org-product-junction.module';
import { GenericUrlModule } from 'src/routes/generic/generic-url.module';
import { ProductTestsModule } from 'src/routes/product_tests/product_tests/product_tests.module';
import { CustomerInsightsModule } from 'src/routes/customer-insights/customer-insights.module';
import { ScanLevelModule } from 'src/routes/scan-level/scan-level.module';
import { IndustryTypeModule } from 'src/routes/industry-type/industry-type.module';
import { AppVersionModule } from 'src/routes/app-version/app-version.module';
/**
 * NOTE: Routes are picked on 'first-match'
 *       So the order is important
 */
export const APP_ROUTES = [
  {
    path: 'admin',
    module: AdminModule,
  },
  {
    path: 'sales',
    module: SalesModule,
  },
  {
    path: 'vitals',
    module: VideoToVitalsModule,
  },
  {
    path: 'product',
    module: ProductModule,
  },
  {
    path: 'junction',
    module: UserProductJunctionModule,
  },
  {
    path: 'notification',
    module: SendEmailModule,
  },
  {
    path: 'orgJunction',
    module: OrgProductJunctionModule,
  },
  {
    path: 'user',
    module: IndividualUserModule,
  },
  {
    path: 'profile_info',
    module: ProfileInfoModule,
  },
  {
    path: 'tpa',
    module: ThirdpartyOrganizationModule,
  },
  {
    path: 'generic',
    module: GenericUrlModule,
  },
  {
    path: 'product_tests',
    module: ProductTestsModule,
  },
  {
    path: 'customer_insights',
    module: CustomerInsightsModule,
  },
  {
    path: 'scan_level',
    module: ScanLevelModule,
  },
  {
    path: 'industry_type',
    module: IndustryTypeModule,
  },
  {
    path: 'app_version',
    module: AppVersionModule,
  },
];
