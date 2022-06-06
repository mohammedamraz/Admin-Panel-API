import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { ConfigService } from '../config/config.service';
import { DatabaseModuleOptions } from '../database/interfaces/database-options.interface';
export declare class DatabaseModuleConfig implements ModuleConfigFactory<DatabaseModuleOptions> {
    private readonly configService;
    constructor(configService: ConfigService);
    createModuleConfig(): DatabaseModuleOptions;
}
