import { AdminModule } from 'src/routes/admin/admin.module';
import { SalesModule } from 'src/routes/sales/sales.module';
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
];
