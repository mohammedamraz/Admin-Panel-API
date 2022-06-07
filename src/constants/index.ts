import { LogLevel } from '@nestjs/common';
import packageJson from 'package.json';

export const FEDO_APP = process.env.FEDO_APP || 'HSA';
export const HOST = process.env.FEDO_HSA_SERVER_HOST || '0.0.0.0';
export const PORT = parseInt(process.env.FEDO_HSA_SERVER_PORT, 10) || 36000;
export const APP_VERSION = packageJson.version;
export const DEBUG_LEVEL = process.env.FEDO_HSA_SERVER_LOG_LEVEL || 'debug';
export const APP_DOCUMENTATION = process.env.FEDO_HSA_SERVER_DOCUMENTATION || 'https://fedo.health/hsa/docs';
export const POSTGRES_DB_URI_DB_URL = process.env.FEDO_HSA_SERVER_DB_URI || 'postgresql://postgres:ban0Malik@localhost:5432/fedo-hsa';

export const AKASH_ACCOUNTID = process.env.FEDO_HSA_TWILIO_ACCOUNTID || "ACff6fccefe46883e8857e636bec9575f0";
export const AKASH_AUTHTOKEN = process.env.FEDO_HSA_TWILIO_AUTHTOKEN || "73b826f040ca14bdde6aaa8f4ea4fb44";
export const AKASH_SERVICEID = process.env.FEDO_HSA_TWILIO_SERVICEID || "VA3b831c8b177fb8226f87f1c6f4b0dae5";

export const APP_DOWNLOAD_LINK = process.env.FEDO_HSA_APP_DOWNLOAD_LINK || "https://play.google.com/store/apps/details?id=com.fedo.auth";

export const AWS_ACCESS_KEY_ID = process.env.FEDO_HSA_AWS_ACCESS_KEY_ID || 'AKIAWVJICQ3FDBOB6CGC';
export const AWS_SECRET_ACCESS_KEY = process.env.FEDO_HSA_AWS_SECRET_ACCESS_KEY || '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';
export const SES_SOURCE_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SOURCE_EMAIL || "FEDO HSA <hsa@fedo.ai>";
export const SES_SOURCE_SUPPORT_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SUPPORT_EMAIL || "FEDO HSA <support@fedo.health>";
export const STATIC_IMAGES = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'https://fedo-file-server.s3.ap-south-1.amazonaws.com/images';
export const STATIC_IMAGES_PROFILE = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'C:/static images/';


export const AWS_COGNITO_USER_CREATION_URL_SIT = process.env.FEDO_AWS_COGNITO_USER_CREATION_URL || 'https://dev.fedo.health/hsa/fis/v1/users';
export const PUBLIC_KEY = process.env.FEDO_HSA_AUTH_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\n' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfXWja+0ByJk00BXyoqFh3pPTH\n' +
'tjHjeVOFdoE4D9cVRhV6tjKg1UZQnXBjcXjd/uGMkB9RsWtAaXPSx8Sf30shs7C3\n' +
'JBPjABXoqIgtXirBNmaF4RqdrXh4ZQvRcXvsGBLraDx4bxBdQ5XjW6Ev3t1qGfgP\n' +
'ctTz4aeR/VDrqih4sQIDAQAB\n' +
'-----END PUBLIC KEY-----\n';




export class ZwitchHttpBody {
	[key: string]: any;
}


/**
 * FUNCTIONS
 */




export const debugLevel = ((): LogLevel[] => {
	if (DEBUG_LEVEL == 'debug') return ['debug', 'warn', 'error'];
	if (DEBUG_LEVEL == 'warn') return ['warn', 'error'];
	if (DEBUG_LEVEL == 'error') return ['error'];
})();

/**
 *
 * NOTE: Routes should be the last line in this file.
 *
 */

export { APP_ROUTES } from './routes';
