"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const database_module_1 = require("../../lib/database/database.module");
const axios_1 = require("@nestjs/axios");
const template_service_1 = require("../../constants/template.service");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_commission_junction' }),
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_partner' }),
            database_module_1.DatabaseModule.forFeature({ tableName: 'sales_partner_requests' }),
            axios_1.HttpModule.register({
                timeout: 10000,
                maxRedirects: 5
            })
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, template_service_1.TemplateService]
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map