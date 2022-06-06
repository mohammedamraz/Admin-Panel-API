import { AsyncModuleConfig } from '@golevelup/nestjs-modules';
import { DynamicModule } from '@nestjs/common';
import { DatabaseModuleOptions } from './interfaces/database-options.interface';
import { DatabaseFeatureOptions } from './interfaces/database.interface';
export declare class DatabaseModule {
    static forRoot(options: DatabaseModuleOptions): DynamicModule;
    static forRootAsync(options: AsyncModuleConfig<DatabaseModuleOptions>): DynamicModule;
    static forFeature(options: DatabaseFeatureOptions): DynamicModule;
}
