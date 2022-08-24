import { Email } from "aws-sdk/clients/codecommit";
import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSalesJunction {
    sl_no : number;
    sales_code: string;
    commission_amount: number;
    paid_amount: number;
    created_date: string;
    updated_date: Date;
    dues: number;
    total_count: number;
    remarks: string;
    payout : Date;
    status : string;
}

export class CreateSalesPartner {

    id: number;
    name: string;
    @IsPhoneNumber()
    @IsNotEmpty()
    mobile: phoneNumber;
    location: string;
    email: Email;
    // remarks:string;
    @IsNotEmpty()
    commission: number;
    user_id: number;
    sales_code: string;
    is_active: boolean;
    created_date: Date;
    refered_by: string;
    block_account: boolean;
    is_hsa_account: boolean;
    profile_confirmation: boolean;
    sign_up_approved:boolean;
    
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

export interface SalesUserJunction {
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
    customer_id: string;
    mobile:phoneNumber;
    email:Email;

}
export enum Is_active {
    TRUE = 'true',
    FALSE = 'false',
    ALL = ''
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

export class LoginDTO{
    @IsNotEmpty()
    @IsPhoneNumber()
    mobile: string;
}





export enum Periodicity {

    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    HALF_YEARLY = 'halfyearly',
    YEARLY = 'yearly',
    DECADE = 'decade'
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
    daily: '1',
    weekly: '7',
    monthly: '30',
    quarterly: '90',
    halfyearly: '180',
    yearly: '365'
}

export class EarningResponse {
    earnedAmount: number;
    paidAmount: number;
}

export const Interval = (period: Period) => PERIOD[period.period]
export const makeEarningFormat = (earning: number[]): EarningResponse =>
({
    earnedAmount: earning[0],
    paidAmount: earning[1]
}
)

export class YearMonthDto {

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(4, { message: 'Enter only 4 digit value of year, This is too short', })
    @MaxLength(4, { message: 'Enter only 4 digit value of year, This is too long', })
    year: string;

    @IsNotEmpty()
    salesCode: string;

}


export class SalesYearMonth extends YearMonthDto {
    @IsNotEmpty()
    @IsNumberString()
    month: string;
}
