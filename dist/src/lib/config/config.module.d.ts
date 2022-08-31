import { ConfigModuleOptions } from './interfaces/config-options.interface';
declare const ConfigModule_base: import("@golevelup/nestjs-modules").IConfigurableDynamicRootModule<ConfigModule, ConfigModuleOptions>;
export declare class ConfigModule extends ConfigModule_base {
    static Deferred: Promise<import("@nestjs/common").DynamicModule>;
}
export {};
