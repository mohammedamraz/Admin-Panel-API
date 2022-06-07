import { Email } from "aws-sdk/clients/codecommit";
import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class CreateSalesJunction {
    sales_code: string;
    commission_amount :number;
    paid_amount: number;
    created_date: string;
    updated_date: Date;
    dues:number;

}

export class CreateSalesPartner {

    id: number;
    name: string;

    @IsNotEmpty()
    mobile: phoneNumber;


    location: string;

    @IsEmail()
    email: Email;

    @IsNotEmpty()
    commission: number;
    user_id: number;
    sales_code: string;
    is_active: boolean;
    created_date: Date;
    refered_by: string;
    block_account: boolean;

    @IsNotEmpty()
    profile_confirmation: boolean;
    }

export class CreateSalesPartnerRequest {
    @IsNotEmpty()
    sales_code: string;

    @IsNotEmpty()
    request_id: string;

    id: string;
}

export class CreateWithdrawn {
    id: string;
    @IsNotEmpty()
    created_date: Date;

    @IsNotEmpty()
    updated_date: Date;

    @IsNotEmpty()
    sp_id: string;

    @IsNotEmpty()
    paid_amount: number;
}

export interface SalesUserJunction{
    id: number;
    sales_code: string;
    users: number;
    created_date: string;
    updated_date: string;
}

export class CreateSalesInvitationJunction {
    refered_by: string;
    sp_id: string;
    created_date: Date;
}

export class UpdateSalesPartner {
    name: string;
    location: string;
    commission: number;
    user_image: string;
    user_id: string;
    sales_code: string;
    block_account: boolean;
    profile_confirmation: boolean;
}
export enum Is_active {
    TRUE = 'true',
    FALSE = 'false'
}

export class ZQueryParamsDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    date?: string;

    @IsOptional()
    number_of_pages?: number;

    @IsOptional()
    number_of_rows?: number;
    @IsOptional()

    @IsEnum(Is_active)
    is_active: Is_active;
}


export enum Periodicity {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    HALF_YEARLY = 'halfyearly',
    YEARLY = 'yearly',
}

export class UpdateImageDTO {
    user_image: string;
}

export class Period {
    @IsNotEmpty()
    @IsEnum(Periodicity)
    period: Periodicity;
}

export const PERIOD = {
    daily: '1 day',
    weekly: '1 week',
    monthly: '1 months',
    quarterly: '3 months',
    halfyearly: '6 months',
    yearly: '12 months'
}

export class EarningResponse {
    earnedAmount: number;
    paidAmount: number;
}

export const Interval = (period: Period) => PERIOD[period.period]
export const makeEarningFormat =(earning:number[]): EarningResponse=>{
    return {
        earnedAmount: earning[0],
        paidAmount: earning[1]
    }
}