import { Email } from "aws-sdk/clients/codecommit";
import { phoneNumber } from "aws-sdk/clients/importexport";
export declare class CreateSalesJunction {
    sales_code: string;
    commission_amount: number;
    paid_amount: number;
    created_date: string;
    updated_date: Date;
    dues: number;
    total_count: number;
}
export declare class CreateSalesPartner {
    id: number;
    name: string;
    mobile: phoneNumber;
    location: string;
    email: Email;
    commission: number;
    user_id: number;
    sales_code: string;
    is_active: boolean;
    created_date: Date;
    refered_by: string;
    block_account: boolean;
    is_hsa_account: boolean;
    profile_confirmation: boolean;
}
export declare class CreateSalesPartnerRequest {
    sales_code: string;
    request_id: string;
    id: string;
}
export declare class CreateWithdrawn {
    id: string;
    created_date: Date;
    updated_date: Date;
    sp_id: string;
    paid_amount: number;
}
export interface SalesUserJunction {
    id: number;
    sales_code: string;
    users: number;
    created_date: string;
    updated_date: string;
}
export declare class CreateSalesInvitationJunction {
    refered_by: string;
    sp_id: string;
    created_date: Date;
}
export declare class UpdateSalesPartner {
    name: string;
    location: string;
    commission: number;
    user_image: string;
    user_id: string;
    sales_code: string;
    block_account: boolean;
    profile_confirmation: boolean;
    customer_id: string;
    mobile: phoneNumber;
    email: Email;
}
export declare enum Is_active {
    TRUE = "true",
    FALSE = "false"
}
export declare class ZQueryParamsDto {
    name?: string;
    date?: string;
    number_of_pages?: number;
    number_of_rows?: number;
    is_active: Is_active;
}
export declare class LoginDTO {
    mobile: string;
}
export declare enum Periodicity {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    HALF_YEARLY = "halfyearly",
    YEARLY = "yearly",
    DECADE = "decade"
}
export declare class UpdateImageDTO {
    user_image: string;
}
export declare class Period {
    period: Periodicity;
}
export declare const PERIOD: {
    daily: string;
    weekly: string;
    monthly: string;
    quarterly: string;
    halfyearly: string;
    yearly: string;
};
export declare class EarningResponse {
    earnedAmount: number;
    paidAmount: number;
}
export declare const Interval: (period: Period) => any;
export declare const makeEarningFormat: (earning: number[]) => EarningResponse;
export declare class YearMonthDto {
    year: string;
    salesCode: string;
}
export declare class SalesYearMonth extends YearMonthDto {
    month: string;
}
