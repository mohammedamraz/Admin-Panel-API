"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ROUTES = exports.getQueryParameterFromURL = exports.debugLevel = exports.handleControllerError = exports.FILE_REQUEST_HEADERS = exports.REQUEST_HEADERS = exports.handleServiceError = exports.transformSubDocument = exports.transformDocument = exports.ZwitchHttpBody = exports.POSTGRES_DB_URI_DB_URL = exports.APP_DOCUMENTATION = exports.DEBUG_LEVEL = exports.APP_VERSION = exports.PORT = exports.HOST = exports.FEDO_APP = void 0;
const common_1 = require("@nestjs/common");
const package_json_1 = require("../../package.json");
exports.FEDO_APP = process.env.FEDO_APP || 'HSA';
exports.HOST = process.env.FEDO_HSA_SERVER_HOST || '0.0.0.0';
exports.PORT = parseInt(process.env.FEDO_HSA_SERVER_PORT, 10) || 35000;
exports.APP_VERSION = package_json_1.default.version;
exports.DEBUG_LEVEL = process.env.FEDO_HSA_SERVER_LOG_LEVEL || 'debug';
exports.APP_DOCUMENTATION = process.env.FEDO_HSA_SERVER_DOCUMENTATION || 'https://fedo.health/hsa/docs';
exports.POSTGRES_DB_URI_DB_URL = process.env.FEDO_HSA_SERVER_DB_URI || 'postgresql://postgres:admin@localhost:5432/fedo-sales';
class ZwitchHttpBody {
}
exports.ZwitchHttpBody = ZwitchHttpBody;
exports.transformDocument = {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        delete ret._id;
        return ret;
    },
};
exports.transformSubDocument = {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
};
const handleServiceError = (app, msg) => {
    return (err) => {
        common_1.Logger.error(`${msg} ${err.name}: ${err.message}`, app);
        throw err;
    };
};
exports.handleServiceError = handleServiceError;
exports.REQUEST_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: OPEN_ACCOUNT_AUTH_HEADER,
};
exports.FILE_REQUEST_HEADERS = {
    'Content-Type': 'multipart/form-data',
    Authorization: OPEN_ACCOUNT_AUTH_HEADER,
};
const handleControllerError = (app, msg) => {
    return (err) => {
        common_1.Logger.error(`${msg} ${err.name} : ${err.message}`, app);
        throw new common_1.ServiceUnavailableException(err.message || JSON.stringify(err));
    };
};
exports.handleControllerError = handleControllerError;
exports.debugLevel = (() => {
    if (exports.DEBUG_LEVEL == 'debug')
        return ['debug', 'warn', 'error'];
    if (exports.DEBUG_LEVEL == 'warn')
        return ['warn', 'error'];
    if (exports.DEBUG_LEVEL == 'error')
        return ['error'];
})();
const getQueryParameterFromURL = (url, searchStr) => url.split('?')[1].split('&').map(e => e.split('=')).find(e => e[0] == searchStr)[1] || null;
exports.getQueryParameterFromURL = getQueryParameterFromURL;
var routes_1 = require("./routes");
Object.defineProperty(exports, "APP_ROUTES", { enumerable: true, get: function () { return routes_1.APP_ROUTES; } });
//# sourceMappingURL=index.js.map