"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./lib/database/database.module");
const options_1 = require("./lib/options");
const config_config_1 = require("./lib/options/config.config");
const config_module_1 = require("./lib/config/config.module");
const core_1 = require("@nestjs/core");
const routes_1 = require("./constants/routes");
const sales_module_1 = require("./routes/sales/sales.module");
const admin_module_1 = require("./routes/admin/admin.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_1.RouterModule.register(routes_1.APP_ROUTES),
            config_module_1.ConfigModule.forRootAsync(config_module_1.ConfigModule, {
                useClass: config_config_1.ConfigModuleConfig,
            }),
            database_module_1.DatabaseModule.forRootAsync({
                imports: [config_module_1.ConfigModule.Deferred],
                useClass: options_1.DatabaseModuleConfig,
            }),
            sales_module_1.SalesModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map