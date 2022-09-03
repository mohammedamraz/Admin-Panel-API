import { LogLevel } from '@nestjs/common';
import packageJson from 'package.json';

export const FEDO_APP = process.env.FEDO_APP || 'HSA_DEV';


export const FEDO_APP_CLIENT_NAME = process.env.FEDO_APP_CLIENT_NAME || 'HSA-SALESADMIN-AppClient';
export const FEDO_APP_CLIENT_ID = process.env.FEDO_APP || '4iaahrh33ojt8sh0vq96toi5em';


// export const FEDO_USER_POOL_NAME = process.env.FEDO_USER_POOL_NAME || 'HSA-SALES-ADMIN';
export const FEDO_USER_ADMIN_PANEL_POOL_NAME = process.env.FEDO_USER_ADMIN_PANEL_POOL_NAME || 'HSA-Admin-Panel';
export const FEDO_APP_ADMIN_PANEL_CLIENT_NAME = process.env.FEDO_APP_ADMIN_PANEL_CLIENT_NAME || 'HSA-AdminPanel-AppClient';
export const FEDO_APP_ADMIN_PANEL_CLIENT_ID = process.env.FEDO_APP_ADMIN_PANEL_CLIENT_ID || '18imhpa3fbpbj66n4r1vovkftt';



export const HOST = process.env.FEDO_HSA_SALES_SERVER_HOST || '0.0.0.0';
export const PORT = parseInt(process.env.FEDO_HSA_SALES_SERVER_PORT, 10) || 36000;
export const APP_VERSION = packageJson.version;
export const DEBUG_LEVEL = process.env.FEDO_HSA_SALES_SERVER_LOG_LEVEL || 'debug';
export const APP_DOCUMENTATION = process.env.FEDO_HSA_SERVER_DOCUMENTATION || 'https://fedo.health/hsa/docs';
export const POSTGRES_DB_URI_DB_URL = process.env.FEDO_HSA_SALES_SERVER_DB_URI || 'postgresql://postgres:ban0Malik@localhost:5432/hsa_sales';
// export const POSTGRES_DB_URI_DB_URL = process.env.FEDO_HSA_SALES_SERVER_DB_URI || 'postgresql://postgres:akash@localhost:5432/hsa-sales';

export const AMRAZ_AUTHTOKEN = process.env.FEDO_HSA_SALES_TWILIO_AUTHTOKEN || "a8eeaa76be56a78e5a8acfb19d1856d8";

export const AMRAZ_SERVICEID = process.env.FEDO_HSA_SALES_TWILIO_SERVICEID || "VAacc33dac237b0b99f98fe86c8797331f";

export const AMRAZ_ACCOUNTID = process.env.FEDO_HSA_SALES_TWILIO_ACCOUNTID || "ACf41247f2800bab4b458b446232ee4d88";

export const TWILIO_PHONE_NUMBER = process.env.FEDO_HSA_SALES_TWILIO_PHONE_NUMBER || "+19804093072";

export const TWILIO_WHATSAPP_NUMBER = process.env.FEDO_HSA_SALES_TWILIO_WHATSAPP_NUMBER || "+14155238886";

export const GUPSHUP_OTP_VERIFICATION=process.env.GUPSHUP_OTP_VERIFICATION_URL || 'https://enterprise.smsgupshup.com/GatewayAPI/rest?userid=2000213582&password=WiZKqcraG&method=TWO_FACTOR_AUTH&v=1.1';
export const GUPSHUP_OTP_MESSAGE_FORMAT=process.env.GUPSHUP_OTP_MESSAGE_FORMAT_URL || '&msg=%25code%25 Is%20Your%20OTP%20-%20FEDO&format=text&otpCodeLength=6&otpCodeType=NUMERIC'

export const APP_DOWNLOAD_LINK = process.env.FEDO_HSA_APP_DOWNLOAD_LINK || "https://play.google.com/store/apps/details?id=ai.fedo.app";
export const SALES_PARTNER_LINK = process.env.FEDO_HSA_SALES_PARTNER_LINK || "https://localhost:5080/sales-signup";
export const SALES_PARTNER_NOTIFICATION = process.env.FEDO_HSA_SALES_PARTNER_NOTIFICATION || "SALES PARTNER APPROVED";

export const AWS_ACCESS_KEY_ID = process.env.FEDO_HSA_SALES_AWS_ACCESS_KEY_ID || 'AKIAWVJICQ3FDBOB6CGC';
export const AWS_SECRET_ACCESS_KEY = process.env.FEDO_HSA_SALES_AWS_SECRET_ACCESS_KEY || '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';
export const SES_SOURCE_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SOURCE_EMAIL || "FEDO HSA <hsa@fedo.ai>";
export const SES_SOURCE_SUPPORT_EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_SUPPORT_EMAIL || "FEDO HSA <support@fedo.health>";
export const SES_SOURCE_HELLO_SUPPORT__EMAIL = process.env.FEDO_COMM_SERVER_AWS_SES_HELLO_SUPPORT_EMAIL || "FEDO HSA <mohd.amraz0@gmail.com>";
export const STATIC_IMAGES = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'https://fedo-file-server.s3.ap-south-1.amazonaws.com/images';
export const STATIC_IMAGES_PROFILE = process.env.FEDO_HSA_SERVER_STATIC_IMAGES || 'C:/static images/';
export const FEDO_HSA_USER_CONNECTION_URL = process.env.FEDO_HSA_USER_CONNECTION_URL || 'http://0.0.0.0:35000/users/';
export const GOOGLE_APPLICATION_CREDENTIALS="./facial-analysis-b9fe1-firebase-adminsdk-1zbc9-b67a0472af.json";


export const AWS_COGNITO_USER_CREATION_URL_SIT = process.env.FEDO_AWS_COGNITO_USER_CREATION_URL || 'https://dev.fedo.health/hsa/fis/v1/users';
export const PUBLIC_KEY =
	'-----BEGIN PUBLIC KEY-----\n' +
	'MIIEIjANBgkqhkiG9w0BAQEFAAOCBA8AMIIECgKCBAEAo2ylqziqV2jMxA1WFVwa\n' +
	'NuHj7xtedA10DRVTd/eS3AIh20TWBZ1nTv2abI76RlH+0j1JzG5YYwdOK8GCCdJU\n' +
	'iWmaL4KeJu2r0C6CXzFUHqM2DjNSrHuQfdp4PeM2Xl1jbS7+y6baSXXioGqiSdz0\n' +
	'i5R/QNFTNOzDwHsIaHcJLohb/MB9H6pV1g3aCXy7i/db/HGXw4eKA40QGrNkyJYU\n' +
	'u308Wk/VQ1gIUFeabnJ3R1PKX5EJ8nrabpnnT9gz7uN3MTxcKaTVwKNaKgaclHGt\n' +
	'/6m7gnC089EFBsjjcvHkbifikvuqKSTHCUJxNlF/weV38dutT7hbho8/l81UIBu1\n' +
	'ro5vZxUSajWCM674UifPHKFMktDlFqyTs2ny0QfhJ+8tFgK8n0Ywa5MrsBTvZc+D\n' +
	'Q3i/k8pfU7pxREd69zFLVrA/OJMRyUzEhKmFhaOPYLZ6WKgvy/RyMQr9QbpLXPPt\n' +
	'9wRYmOZrjCyaLXKkY58Xvnax3xNsStbO2rVvWd8Q67KlB8ru5AMe6g9RTXVgtfsA\n' +
	'wI8cACFNNe6XW6bQYOJFdL74fn37OOppDiCSBGhx6pJJ0Dw7RBnGY1kQLPoSLW/Y\n' +
	'lUbHBXXAexWDk5Hd6d2ZHFDS0etTe+JttlZfq5zWLB8bYrTr74rKpNK+q3wJ7svv\n' +
	'pqvKh8DYgJTql4j++BauPG0h5uEvJS3SySl2RYBD9emjjJ7R0PgTxVhrkNUVxcs9\n' +
	'cMmUjE250sJZzYdD25b4i9MWJP8U8ex+Xv7/Oflpxl0eqDkWowvYhkN/A94Otz29\n' +
	'lTMTacxfkBMB028G7bUq4RF3pypnx5kIxvmfnxLd9DGUlyqmnGzi6UvO/qrf/u3Q\n' +
	'9P+Oy+fSMBKrmAujKushm/T3FqiTYrDl9017/VNTwV33MXjRYraZX9Di8KCWgtgj\n' +
	'/w3Y/Ju368pMdcEDhG9yJRBccOU1XDDoxp/J08m3Z7XCZ/7I8uLGN2Js1HAmn6ln\n' +
	'Od21cuF46U5Y998o5sbgXzCjwtqxJkdLktyy9U2mnmF23d6h1iZuOU3vR6Q8d/ln\n' +
	'FWKadqqa5LgWWIjqzSMTzI5CFA3CK1Pab71Gbjv5KONfTdGSx/vyjyuHXfruotIS\n' +
	'v+4GMcEEc08ycD+vPXY0jrPKBPaHF7PcBO4qECfgOHQFSaW9KtW158WQYcrfki+t\n' +
	'1oE6Kpo+qiYOrmgb8iE6HOXqhHqGb16UBhp1DvODnUINTIAbOIDfBxcZYxh2Endl\n' +
	'AzC6Sudg4pnUL0itL0Rb7akzRl6qiXiIry2zvya5bGKa3vgJogAWfMCkhrlO3Sxe\n' +
	'5SNhWEEWoDkAyVCBXB3yVPgIM+n1Dfp6NNp3xtJQ6vL4WyafXxZ3Rlf6iPqNoHyh\n' +
	'xwIDAQAB\n' +
	'-----END PUBLIC KEY-----\n';

export const PRIVATE_KEY =
	'-----BEGIN RSA PRIVATE KEY-----\n' +
	'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\n' +
	'-----END RSA PRIVATE KEY-----\n';
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
