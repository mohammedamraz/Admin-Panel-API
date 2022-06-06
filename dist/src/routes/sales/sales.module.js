"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const sales_controller_1 = require("./sales.controller");
const database_module_1 = require("../../lib/database/database.module");
const axios_1 = require("@nestjs/axios");
let SalesModule = class SalesModule {
};
SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_partner' }),
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_commission_junction' }),
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_partner_invitation_junction' }),
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_withdrawn_amount' }),
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5,
            }),
        ],
        controllers: [sales_controller_1.SalesController],
        providers: [sales_service_1.SalesService]
    })
], SalesModule);
exports.SalesModule = SalesModule;
//# sourceMappingURL=sales.module.js.map