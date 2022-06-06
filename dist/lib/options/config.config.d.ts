import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { ConfigModuleOptions } from '../config/interfaces/config-options.interface';
export declare class ConfigModuleConfig implements ModuleConfigFactory<ConfigModuleOptions> {
    createModuleConfig(): ConfigModuleOptions;
}
