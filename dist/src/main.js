"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const compression_1 = __importDefault(require("compression"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: constants_1.debugLevel,
    });
    app.use((0, compression_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(constants_1.PORT, constants_1.HOST, () => {
        common_1.Logger.debug(`Server v${constants_1.APP_VERSION} listening at http://${constants_1.HOST}:${constants_1.PORT}/`, 'FEDO-HSA-SALES-API');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map