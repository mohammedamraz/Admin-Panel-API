import { LogLevel } from '@nestjs/common';
import packageJson from 'package.json';

export const FEDO_APP = process.env.FEDO_APP || 'HSA_DEV';
export const FEDO_USER_POOL_NAME = process.env.FEDO_USER_POOL_NAME || 'HSA-SALES-ADMIN';

export const FEDO_APP_CLIENT_NAME = process.env.FEDO_APP_CLIENT_NAME || 'HSA-SALESADMIN-AppClient';
export const FEDO_APP_CLIENT_ID = process.env.FEDO_APP || '5bgc4vbrj4v0k82gdgddpermg9';

export const HOST = process.env.FEDO_HSA_SALES_SERVER_HOST || '0.0.0.0';
export const PORT = parseInt(process.env.FEDO_HSA_SALES_SERVER_PORT, 10) || 36000;
export const APP_VERSION = packageJson.version;
export const DEBUG_LEVEL = process.env.FEDO_HSA_SALES_SERVER_LOG_LEVEL || 'debug';
export const APP_DOCUMENTATION = process.env.FEDO_HSA_SERVER_DOCUMENTATION || 'https://fedo.health/hsa/docs';
export const POSTGRES_DB_URI_DB_URL = process.env.FEDO_HSA_SALES_SERVER_DB_URI || 'postgresql://postgres:admin@localhost:5432/fedo-sales';

export const AMRAZ_AUTHTOKEN = process.env.FEDO_HSA_SALES_TWILIO_AUTHTOKEN || "3a02e7cc85cc1f8b5ca011fd39c40c0e";
export const AMRAZ_SERVICEID = process.env.FEDO_HSA_SALES_TWILIO_SERVICEID || "VAe2d6baceed7fe5b04fc546d4fa3560f8";
export const AMRAZ_ACCOUNTID = process.env.FEDO_HSA_SALES_TWILIO_ACCOUNTID || "ACee7f5c43cad32fd3a589999f12548b19";
export const TWILIO_PHONE_NUMBER = process.env.FEDO_HSA_SALES_TWILIO_PHONE_NUMBER || "+19784806237";
export const TWILIO_WHATSAPP_NUMBER = process.env.FEDO_HSA_SALES_TWILIO_WHATSAPP_NUMBER || "+14155238886";

export const APP_DOWNLOAD_LINK = process.env.FEDO_HSA_APP_DOWNLOAD_LINK || "https://play.google.com/store/apps/details?id=com.fedo.auth";
export const SALES_PARTNER_LINK = process.env.FEDO_HSA_SALES_PARTNER_LINK || "http://0.0.0.0:35000/sales-partner";
export const SALES_PARTNER_NOTIFICATION = process.env.FEDO_HSA_SALES_PARTNER_NOTIFICATION || "SALES PARTNER APPROVED";

export const AWS_ACCESS_KEY_ID = process.env.FEDO_HSA_SALES_AWS_ACCESS_KEY_ID || 'AKIAWVJICQ3FDBOB6CGC';
export const AWS_SECRET_ACCESS_KEY = process.env.FEDO_HSA_SALES_AWS_SECRET_ACCESS_KEY || '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';
export const SES_SOURCE_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SOURCE_EMAIL || "FEDO HSA <hsa@fedo.ai>";
export const SES_SOURCE_SUPPORT_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SUPPORT_EMAIL || "FEDO HSA <support@fedo.health>";
export const STATIC_IMAGES = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'https://fedo-file-server.s3.ap-south-1.amazonaws.com/images';
export const STATIC_IMAGES_PROFILE = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'C:/static images/';
export const FEDO_HSA_USER_CONNECTION_URL = process.env.FEDO_HSA_USER_CONNECTION_URL || 'http://0.0.0.0:35000/users/';



export const AWS_COGNITO_USER_CREATION_URL_SIT = process.env.FEDO_AWS_COGNITO_USER_CREATION_URL || 'https://dev.fedo.health/hsa/fis/v1/users';
export const PUBLIC_KEY =
	'-----BEGIN PUBLIC KEY-----\n' +
	'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAj7g1NDLeRXzD9Bnh4mCm\n' +
	'B1O2hQxlx4qvCiA9vxKVAvx6GQjWOCZub+nhgbkBfC2441ZLqo0umrmNPTtRy7hK\n' +
	'4yiRwd3TjCoE8kRNkXfZaGfd8xohbO2sORsHqo9ONs60P7zbVYN2YfGksB5m7WhU\n' +
	'prRojiuNU8zQdHVqo6uuE78fBVLXeCWz39ckwKdD1t4TS0ZQ1ipvjfBS2hY3vEQo\n' +
	'rZwtHDdL2KjUmq9Vn6aZqCrJH6xcu7PnZEaIu4X5Wqypwy2vQiuAQ6DZn7QGpnvo\n' +
	'MZlEqxENKhcDjs1crr1TwnPFknmx6wllKaZNmBgN3+DD/Vb+4T1Pbu9zEfMoHIGd\n' +
	'BfDCjw7772iYdwSrXeSIn6HbLQTeU9iPFg6qxH/Hs26p0nn8NzI8Vl57BYIMHNZs\n' +
	'Ct2x/x0AHGfS0edQ8XKHy4UTVnLu/nWCwDFq/zLl1gSyEk3XAVQ3mJ2+HGDBAr2b\n' +
	'bMwc4Qhv1yzLrxaxpDstvMnc+D8zWwja+/TvDfNU0tKG517n7XMHW33clGTkZTYK\n' +
	'GhxSsAAHZdZ/wb/SfPbHO3guvSSXwaPhk+0A3NGjuNVNqtO0UFW86/F4/mgUXTsY\n' +
	'FpZmVTtLRkj0Bncr6KwUSh3ET7zXA1NKzkNLQA/OoqZPTeNalBG0resOg1nyalDL\n' +
	'DR3AKTHjzTQjapvmGU2RaZkCAwEAAQ==\n' +
	'-----END PUBLIC KEY-----\n';

export const PRIVATE_KEY =
	'-----BEGIN RSA PRIVATE KEY-----\n' +
	'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\n' +
	'-----END RSA PRIVATE KEY-----\n'
export class ZwitchHttpBody {
	[key: string]: any;
}

/**
 * FUNCTIONS
 */

export const debugLevel = ((): LogLevel[] => {
	if (DEBUG_LEVEL === 'debug') return ['debug', 'warn', 'error'];
	if (DEBUG_LEVEL === 'warn') return ['warn', 'error'];
	if (DEBUG_LEVEL === 'error') return ['error'];
})();

/**
 *
 * NOTE: Routes should be the last line in this file.
 *
 */

export { APP_ROUTES } from './routes';
