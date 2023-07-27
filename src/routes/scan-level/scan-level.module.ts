import { Module } from '@nestjs/common';
import { ScanLevelController } from './scan-level.controller';
import { ScanLevelService } from './scan-level.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ScanLevelController],
  providers: [ScanLevelService],
  imports: [DatabaseModule.forFeature({ tableName: 'scan_level' }),
  HttpModule.register({
    timeout: 10000,
    maxRedirects: 5
  })
  ]
})
export class ScanLevelModule { }
