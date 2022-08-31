import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './lib/database/database.module';
import { DatabaseModuleConfig } from './lib/options';
import { ConfigModuleConfig } from './lib/options/config.config';
import { ConfigModule } from './lib/config/config.module';
import { RouterModule } from '@nestjs/core';
import { APP_ROUTES } from './constants/routes';
import { SalesModule } from './routes/sales/sales.module';
import { AdminModule } from './routes/admin/admin.module';
import { VideoToVitalsModule } from './routes/video-to-vitals/video-to-vitals.module';
import { ProductModule } from './routes/product/product.module';
import { UserProductJunctionModule } from './routes/user-product-junction/user-product-junction.module';
import { SendEmailModule } from './send-email/send-email.module';
import { OrgProductJunctionModule } from './routes/org-product-junction/org-product-junction.module';
import { IndividualUserModule } from './routes/individual-user/individual-user.module';
import { ProfileInfoModule } from './routes/profile-info/profile-info/profile-info.module';

@Module({
  imports: [
    RouterModule.register(APP_ROUTES),
    ConfigModule.forRootAsync(ConfigModule, {
      useClass: ConfigModuleConfig,
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule.Deferred],
      useClass: DatabaseModuleConfig,
    }),
    SalesModule,
    AdminModule,
    VideoToVitalsModule,
    ProductModule,
    UserProductJunctionModule,
    SendEmailModule,
    OrgProductJunctionModule,
    IndividualUserModule,
    ProfileInfoModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}

