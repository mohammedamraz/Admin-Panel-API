import { AccountZwitchResponseBody, createAccount, User } from "src/routes/admin/dto/create-admin.dto";
export declare const fetchUser: (userId: string) => import("rxjs").Observable<User[]>;
export declare const fetchAccount: (userId: string, accountId: string) => import("rxjs").Observable<AccountZwitchResponseBody>;
export declare const fetchUserByMobileNumber: (phoneNumber: string) => import("rxjs").Observable<User[]>;
export declare const fetchAccountBySalesCode: (salesCode: string) => import("rxjs").Observable<createAccount[]>;
export declare const editFileName: (req: any, file: any, callback: any) => void;
export declare const imageFileFilter: (req: any, file: any, callback: any) => any;
export declare const encryptPassword: (password: any) => any;
