import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports:[
    DatabaseModule.forFeature({ tableName: 'sales_partner' }),
    DatabaseModule.forFeature({ tableName: 'sales_commission_junction' }),
    DatabaseModule.forFeature({ tableName: 'sales_partner_invitation_junction' }),
    DatabaseModule.forFeature({ tableName: 'sales_withdrawn_amount' }),
    DatabaseModule.forFeature({ tableName: 'sales_user_junction' }),

    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}
