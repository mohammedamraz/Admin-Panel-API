import { Module } from '@nestjs/common';
import { IndustryTypeController } from './industry-type.controller';
import { IndustryTypeService } from './industry-type.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [IndustryTypeController],
  providers: [IndustryTypeService],
  imports: [DatabaseModule.forFeature({ tableName: 'industry_type' }),
  HttpModule.register({
    timeout: 10000,
    maxRedirects: 5
  })
  ]
})
export class IndustryTypeModule {}
