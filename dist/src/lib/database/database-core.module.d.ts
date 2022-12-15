import { DatabaseModuleOptions } from './interfaces/database-options.interface';
declare const DatabaseCoreModule_base: import("@golevelup/nestjs-modules").IConfigurableDynamicRootModule<DatabaseCoreModule, DatabaseModuleOptions>;
export declare class DatabaseCoreModule extends DatabaseCoreModule_base {
    static Deferred: Promise<import("@nestjs/common").DynamicModule>;
}
export {};
