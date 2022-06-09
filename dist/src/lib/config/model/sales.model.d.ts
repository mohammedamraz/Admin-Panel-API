import { Email } from "@deepkit/type";
import { phoneNumber } from "aws-sdk/clients/importexport";
export declare class CreateSalesPartnerModel {
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
    profile_confirmation: boolean;
    total_commission: number;
    user_image: string;
}
