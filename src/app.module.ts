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
    AdminModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}

