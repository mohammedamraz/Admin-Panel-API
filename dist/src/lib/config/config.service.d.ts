import { DatabaseModuleOptions } from '../database/interfaces/database-options.interface';
import { ConfigModuleOptions } from './interfaces/config-options.interface';
export declare class ConfigService {
    private envConfig;
    constructor(options: ConfigModuleOptions);
    get databaseUrl(): string;
    get isProd(): boolean;
    get databaseConfig(): DatabaseModuleOptions;
    get nodeEnv(): string;
    get globalPrefix(): string;
    get port(): number;
    get applicationName(): string;
}
