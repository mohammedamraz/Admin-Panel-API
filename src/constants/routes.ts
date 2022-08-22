import { AdminModule } from 'src/routes/admin/admin.module';
import { SalesModule } from 'src/routes/sales/sales.module';
import { VideoToVitalsModule } from 'src/video-to-vitals/video-to-vitals.module';
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
];
