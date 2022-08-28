import { AdminModule } from 'src/routes/admin/admin.module';
import { IndividualUserModule } from 'src/routes/individual-user/individual-user.module';
import { ProductModule } from 'src/routes/product/product.module';
import { SalesModule } from 'src/routes/sales/sales.module';
import { UserProductJunctionModule } from 'src/routes/user-product-junction/user-product-junction.module';
import { VideoToVitalsModule } from 'src/routes/video-to-vitals/video-to-vitals.module';
import { SendEmailModule } from 'src/send-email/send-email.module';
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
    path: 'user',
    module: IndividualUserModule,
  },
];
