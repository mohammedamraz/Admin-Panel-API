"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseProviders = exports.createDatabaseProviderToken = exports.createDatabasePoolConnection = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const constants_1 = require("../../constants");
const database_constants_1 = require("./database.constants");
const database_service_1 = require("./database.service");
function createDatabasePoolConnection() {
    return {
        provide: database_constants_1.DATABASE_POOL,
        useFactory: async (options) => {
            const pool = new pg_1.Pool({
                connectionString: constants_1.POSTGRES_DB_URI_DB_URL,
            });
            return (0, rxjs_1.from)(pool.connect())
                .pipe((0, operators_1.retryWhen)((e) => e.pipe((0, operators_1.scan)((errorCount, error) => {
                common_1.Logger.warn(`Unable to connect to database. ${error.message}. Retrying ${errorCount + 1}...`);
                if (errorCount + 1 > 9) {
                    throw error;
                }
                return errorCount + 1;
            }, 0), (0, operators_1.delay)(1 * 1000))))
                .toPromise();
        },
        inject: [
            database_constants_1.DATABASE_MODULE_OPTIONS,
        ],
    };
}
exports.createDatabasePoolConnection = createDatabasePoolConnection;
function createDatabaseProviderToken(tableName) {
    return `${database_constants_1.DATABASE_FEATURE}:${tableName}`;
}
exports.createDatabaseProviderToken = createDatabaseProviderToken;
function createDatabaseProviders(feature) {
    const token = createDatabaseProviderToken(feature.tableName);
    return [
        {
            inject: [database_constants_1.DATABASE_POOL],
            provide: token,
            useFactory: (pool) => {
                return new database_service_1.DatabaseService(pool, feature);
            },
        },
    ];
}
exports.createDatabaseProviders = createDatabaseProviders;
//# sourceMappingURL=database.provider.js.map