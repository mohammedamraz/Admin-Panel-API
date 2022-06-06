"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConfigModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const nestjs_modules_1 = require("@golevelup/nestjs-modules");
const common_1 = require("@nestjs/common");
const config_constants_1 = require("./config.constants");
const config_service_1 = require("./config.service");
let ConfigModule = ConfigModule_1 = class ConfigModule extends (0, nestjs_modules_1.createConfigurableDynamicRootModule)(config_constants_1.CONFIG_MODULE_OPTIONS, {
    providers: [config_service_1.ConfigService],
    exports: [config_service_1.ConfigService],
}) {
};
ConfigModule.Deferred = ConfigModule_1.externallyConfigured(ConfigModule_1, 0);
ConfigModule = ConfigModule_1 = __decorate([
    (0, common_1.Module)({})
], ConfigModule);
exports.ConfigModule = ConfigModule;
//# sourceMappingURL=config.module.js.map