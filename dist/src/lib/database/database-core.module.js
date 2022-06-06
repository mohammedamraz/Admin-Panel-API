"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseCoreModule = void 0;
const nestjs_modules_1 = require("@golevelup/nestjs-modules");
const common_1 = require("@nestjs/common");
const database_constants_1 = require("./database.constants");
let DatabaseCoreModule = DatabaseCoreModule_1 = class DatabaseCoreModule extends (0, nestjs_modules_1.createConfigurableDynamicRootModule)(database_constants_1.DATABASE_MODULE_OPTIONS, {
    exports: [database_constants_1.DATABASE_MODULE_OPTIONS],
}) {
};
DatabaseCoreModule.Deferred = DatabaseCoreModule_1.externallyConfigured(DatabaseCoreModule_1, 500);
DatabaseCoreModule = DatabaseCoreModule_1 = __decorate([
    (0, common_1.Module)({})
], DatabaseCoreModule);
exports.DatabaseCoreModule = DatabaseCoreModule;
//# sourceMappingURL=database-core.module.js.map