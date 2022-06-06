"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const database_core_module_1 = require("./database-core.module");
const database_provider_1 = require("./database.provider");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const dbModule = database_core_module_1.DatabaseCoreModule.forRoot(database_core_module_1.DatabaseCoreModule, options);
        dbModule.imports = dbModule.imports.concat();
        return dbModule;
    }
    static forRootAsync(options) {
        const dbModule = database_core_module_1.DatabaseCoreModule.forRootAsync(database_core_module_1.DatabaseCoreModule, options);
        dbModule.imports = dbModule.imports.concat();
        return dbModule;
    }
    static forFeature(options) {
        const databaseProvider = (0, database_provider_1.createDatabaseProviders)(options);
        return {
            module: DatabaseModule_1,
            imports: [
                database_core_module_1.DatabaseCoreModule.Deferred,
            ],
            providers: [(0, database_provider_1.createDatabasePoolConnection)(), ...databaseProvider],
            exports: [...databaseProvider],
        };
    }
};
DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Module)({})
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map