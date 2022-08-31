import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/lib/database/database.module';
import { ProfileInfoController } from './profile-info.controller';
import { ProfileInfoService } from './profile-info.service';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'user_profile_info' }),
    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'organization' }),

    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    })]
,  controllers: [ProfileInfoController],
  providers: [ProfileInfoService]
})
export class ProfileInfoModule {}
