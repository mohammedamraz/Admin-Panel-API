import { LogLevel } from '@nestjs/common';
export declare const FEDO_APP: string;
export declare const HOST: string;
export declare const PORT: number;
export declare const APP_VERSION: any;
export declare const DEBUG_LEVEL: string;
export declare const APP_DOCUMENTATION: string;
export declare const POSTGRES_DB_URI_DB_URL: string;
export declare class ZwitchHttpBody {
    [key: string]: any;
}
export declare const transformDocument: {
    transform: (doc: any, ret: any) => any;
};
export declare const transformSubDocument: {
    transform: (doc: any, ret: any) => void;
};
export declare const handleServiceError: (app: string, msg: string) => (err: Error) => never;
export declare const REQUEST_HEADERS: {
    'Content-Type': string;
    Authorization: any;
};
export declare const FILE_REQUEST_HEADERS: {
    'Content-Type': string;
    Authorization: any;
};
export declare const handleControllerError: (app: string, msg: string) => (err: Error) => never;
export declare const debugLevel: LogLevel[];
export declare const getQueryParameterFromURL: (url: any, searchStr: any) => any;
export { APP_ROUTES } from './routes';
