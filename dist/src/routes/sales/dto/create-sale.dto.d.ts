import { Email } from "aws-sdk/clients/codecommit";
import { phoneNumber } from "aws-sdk/clients/importexport";
export declare class CreateSalesJunction {
    sales_code: string;
    commission_amount: number;
    paid_amount: number;
    created_date: string;
    updated_date: Date;
    dues: number;
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
}
export declare class ZQueryParamsDto {
    name?: string;
    date?: string;
    number_of_pages?: number;
    number_of_rows?: number;
}
export declare enum Periodicity {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    HALF_YEARLY = "halfyearly",
    YEARLY = "yearly"
}
export declare class UpdateImageDTO {
    user_image: string;
}
export declare class Period {
    period: Periodicity;
}
export declare const PERIOD: {
    monthly: string;
    quarterly: string;
    halfyearly: string;
    yearly: string;
};
export declare class EarningResponse {
    earnedAmount: number;
    paidAmount: number;
}
export declare const Interval: (period: Period) => string;
export declare const makeEarningFormat: (earning: number[]) => EarningResponse;
