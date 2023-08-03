import { Module } from '@nestjs/common';
import { CustomerInsightsController } from './customer-insights.controller';
import { CustomerInsightsService } from './customer-insights.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CustomerInsightsController],
  providers: [CustomerInsightsService],
  imports: [DatabaseModule.forFeature({ tableName: 'customer_insights' }),
  HttpModule.register({
    timeout: 10000,
    maxRedirects: 5
  })]
})
export class CustomerInsightsModule { }
