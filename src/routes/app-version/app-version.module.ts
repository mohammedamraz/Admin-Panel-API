import { Module } from '@nestjs/common';
import { AppVersionController } from './app-version.controller';
import { AppVersionService } from './app-version.service';
import { DatabaseModule } from 'src/lib/database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AppVersionController],
  providers: [AppVersionService],
  imports: [DatabaseModule.forFeature({ tableName: 'app_version' }),
  HttpModule.register({
    timeout: 10000,
    maxRedirects: 5
  })
  ]
})
export class AppVersionModule {}
