import { Provider } from '@nestjs/common';
import { DatabaseFeatureOptions } from './interfaces/database.interface';
export declare function createDatabasePoolConnection(): Provider;
export declare function createDatabaseProviderToken(tableName: string): string;
export declare function createDatabaseProviders(feature: DatabaseFeatureOptions): Provider[];
