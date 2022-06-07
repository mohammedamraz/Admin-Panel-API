"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ROUTES = exports.debugLevel = exports.ZwitchHttpBody = exports.PUBLIC_KEY = exports.AWS_COGNITO_USER_CREATION_URL_SIT = exports.STATIC_IMAGES_PROFILE = exports.STATIC_IMAGES = exports.SES_SOURCE_SUPPORT_EMAIL = exports.SES_SOURCE_EMAIL = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.SALES_PARTNER_LINK = exports.APP_DOWNLOAD_LINK = exports.AKASH_SERVICEID = exports.AKASH_AUTHTOKEN = exports.AKASH_ACCOUNTID = exports.POSTGRES_DB_URI_DB_URL = exports.APP_DOCUMENTATION = exports.DEBUG_LEVEL = exports.APP_VERSION = exports.PORT = exports.HOST = exports.FEDO_APP = void 0;
const package_json_1 = __importDefault(require("../../package.json"));
exports.FEDO_APP = process.env.FEDO_APP || 'HSA';
exports.HOST = process.env.FEDO_HSA_SERVER_HOST || '0.0.0.0';
exports.PORT = parseInt(process.env.FEDO_HSA_SERVER_PORT, 10) || 36000;
exports.APP_VERSION = package_json_1.default.version;
exports.DEBUG_LEVEL = process.env.FEDO_HSA_SERVER_LOG_LEVEL || 'debug';
exports.APP_DOCUMENTATION = process.env.FEDO_HSA_SERVER_DOCUMENTATION || 'https://fedo.health/hsa/docs';
exports.POSTGRES_DB_URI_DB_URL = process.env.FEDO_HSA_SERVER_DB_URI || 'postgresql://postgres:Fedo@1234@localhost:5432/HSA_Sales';
exports.AKASH_ACCOUNTID = process.env.FEDO_HSA_TWILIO_ACCOUNTID || "ACff6fccefe46883e8857e636bec9575f0";
exports.AKASH_AUTHTOKEN = process.env.FEDO_HSA_TWILIO_AUTHTOKEN || "73b826f040ca14bdde6aaa8f4ea4fb44";
exports.AKASH_SERVICEID = process.env.FEDO_HSA_TWILIO_SERVICEID || "VA3b831c8b177fb8226f87f1c6f4b0dae5";
exports.APP_DOWNLOAD_LINK = process.env.FEDO_HSA_APP_DOWNLOAD_LINK || "https://play.google.com/store/apps/details?id=com.fedo.auth";
exports.SALES_PARTNER_LINK = process.env.FEDO_HSA_SALES_PARTNER_LINK || "http://0.0.0.0:35000/sales-partner";
exports.AWS_ACCESS_KEY_ID = process.env.FEDO_HSA_AWS_ACCESS_KEY_ID || 'AKIAWVJICQ3FDBOB6CGC';
exports.AWS_SECRET_ACCESS_KEY = process.env.FEDO_HSA_AWS_SECRET_ACCESS_KEY || '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';
exports.SES_SOURCE_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SOURCE_EMAIL || "FEDO HSA <hsa@fedo.ai>";
exports.SES_SOURCE_SUPPORT_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SUPPORT_EMAIL || "FEDO HSA <support@fedo.health>";
exports.STATIC_IMAGES = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'https://fedo-file-server.s3.ap-south-1.amazonaws.com/images';
exports.STATIC_IMAGES_PROFILE = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'C:/static images/';
exports.AWS_COGNITO_USER_CREATION_URL_SIT = process.env.FEDO_AWS_COGNITO_USER_CREATION_URL || 'https://dev.fedo.health/hsa/fis/v1/users';
exports.PUBLIC_KEY = process.env.FEDO_HSA_AUTH_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfXWja+0ByJk00BXyoqFh3pPTH\n' +
    'tjHjeVOFdoE4D9cVRhV6tjKg1UZQnXBjcXjd/uGMkB9RsWtAaXPSx8Sf30shs7C3\n' +
    'JBPjABXoqIgtXirBNmaF4RqdrXh4ZQvRcXvsGBLraDx4bxBdQ5XjW6Ev3t1qGfgP\n' +
    'ctTz4aeR/VDrqih4sQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';
class ZwitchHttpBody {
}
exports.ZwitchHttpBody = ZwitchHttpBody;
exports.debugLevel = (() => {
    if (exports.DEBUG_LEVEL == 'debug')
        return ['debug', 'warn', 'error'];
    if (exports.DEBUG_LEVEL == 'warn')
        return ['warn', 'error'];
    if (exports.DEBUG_LEVEL == 'error')
        return ['error'];
})();
var routes_1 = require("./routes");
Object.defineProperty(exports, "APP_ROUTES", { enumerable: true, get: function () { return routes_1.APP_ROUTES; } });
//# sourceMappingURL=index.js.map