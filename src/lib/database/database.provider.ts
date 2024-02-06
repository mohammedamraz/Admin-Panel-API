import { Logger, Provider } from '@nestjs/common';
// import { createProviderToken } from '@ogma/nestjs-module';
import { Pool } from 'pg';
import { from } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { POSTGRES_DB_URI_DB_URL } from 'src/constants';
import { DATABASE_FEATURE, DATABASE_MODULE_OPTIONS, DATABASE_POOL } from './database.constants';
import { DatabaseService } from './database.service';
import { DatabaseModuleOptions } from './interfaces/database-options.interface';
import { DatabaseFeatureOptions } from './interfaces/database.interface';

export function createDatabasePoolConnection(): Provider {
  console.log("this is loading initailly")
  return {
    provide: DATABASE_POOL,
    useFactory: async (options: DatabaseModuleOptions) => {
      const pool = new Pool({
        connectionString: POSTGRES_DB_URI_DB_URL,     
       });
      return from(pool.connect())  
        .pipe(
          retryWhen((e) =>
            e.pipe(
              scan((errorCount: number, error: Error) => {
                Logger.warn(
                  `Unable to connect to database. ${error.message}. Retrying ${errorCount + 1
                  }...`,
                );
                if (errorCount + 1 > 9) {
                  throw error;
                }
                return errorCount + 1;
              }, 0),
              delay(1 * 1000),
            ),
          ),
        )
        .toPromise();
    },
    inject: [
      DATABASE_MODULE_OPTIONS,
      // createProviderToken('DatabaseConnectionProvider'),
    ],
  };
}

export function createDatabaseProviderToken(tableName: string): string {
  return `${DATABASE_FEATURE}:${tableName}`;
}

export function createDatabaseProviders(
  feature: DatabaseFeatureOptions,
): Provider[] {
  const token = createDatabaseProviderToken(feature.tableName);
  return [
    {
      inject: [DATABASE_POOL],
      provide: token,
      useFactory: (pool: Pool) => {
        return new DatabaseService(pool, feature);
      },
    },
  ];
}
