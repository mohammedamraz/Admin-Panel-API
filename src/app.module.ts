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
import { OrgProductJunctionModule } from './routes/org-product-junction/org-product-junction.module';
import { IndividualUserModule } from './routes/individual-user/individual-user.module';
import { ProfileInfoModule } from './routes/profile-info/profile-info/profile-info.module';
import { ThirdpartyOrganizationModule } from './routes/thirdparty-organization/thirdparty-organization.module';
import { SendEmailModule } from './routes/send-email/send-email.module';
import { GenericUrlModule } from './routes/generic/generic-url.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductTestsModule } from './routes/product_tests/product_tests/product_tests.module';
import { CustomerInsightsModule } from './routes/customer-insights/customer-insights.module';
import { ScanLevelModule } from './routes/scan-level/scan-level.module';

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
    ProfileInfoModule,
    ThirdpartyOrganizationModule,
    GenericUrlModule,
    ProductTestsModule,
    ScheduleModule.forRoot(),
    CustomerInsightsModule,
    ScanLevelModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}

