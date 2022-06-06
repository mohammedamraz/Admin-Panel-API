"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const config_constants_1 = require("./config.constants");
let ConfigService = class ConfigService {
    constructor(options) {
        if (!options.useProcess && !options.fileName) {
            throw new Error('Missing configuration options.' +
                ' If using process.env variables, please mark useProcess as "true".' +
                ' Otherwise, please provide and env file.');
        }
    }
    get databaseUrl() {
        return constants_1.POSTGRES_DB_URI_DB_URL;
    }
    get isProd() {
        const env = this.nodeEnv.toLowerCase();
        return env === 'production' || env === 'prod';
    }
    get databaseConfig() {
        return {
            connectionUrl: this.databaseUrl,
            ssl: this.isProd,
        };
    }
    get nodeEnv() {
        return "test";
    }
    get globalPrefix() {
        return this.envConfig.GLOBAL_PREFIX;
    }
    get port() {
        return this.envConfig.PORT;
    }
    get applicationName() {
        return "HSA";
    }
};
ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_constants_1.CONFIG_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map