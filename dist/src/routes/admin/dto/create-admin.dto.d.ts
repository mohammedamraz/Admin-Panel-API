import { phoneNumber } from 'aws-sdk/clients/importexport';
export declare class MobileNumberDtO {
    phoneNumber: phoneNumber;
    commission: number;
}
export declare class MobileNumberAndOtpDtO {
    phoneNumber: phoneNumber;
    otp: number;
}
export declare class requestDto {
    message: string[];
}
export declare class ParamDto {
    mobileNumber: string;
}
export declare class User {
    fedo_id: string;
    created_date: string;
    updated_date: string;
    is_active: string;
    email: string;
    secret_key: string;
    account_id: number;
    demographic_id: string;
    channel_id: string;
    pan_id: string;
    aadhaar_id: string;
    userreference_id: string;
    kycschedule: string;
    mobile: phoneNumber;
}
export declare class AccountZwitchResponseBody {
    id: string;
    object: string;
    type: string;
    title: string;
    name: string;
    mobile_number: string;
    account_number: string;
    ifsc_code: string;
    bank_customer_id: string;
    email: string;
    bank_name: string;
}
export declare class sendEmailOnIncorrectBankDetailsDto {
    name: string;
    email: string;
    message: string[];
    request_id: string;
}
export declare class createAccount {
    id: string;
    created_date: string;
    updated_date: string;
    object: string;
    type: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    vpa: string;
    zwitch_id: string;
    agent_id: string;
    redirection_url: string;
    cost_saving: string;
    virtual_account_id: number;
    bank_customer_id: string;
    savings_beneficiary_id: string;
    partner_id: number;
    sales_code: string;
    fedo_id: string;
    userreference_id: string;
}
export declare class createPaidAmountDto {
    paid_amount: number;
    salesCode: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank: string;
}
export declare class createPaid {
    data: createPaidAmountDto[];
}
export declare class YearMonthDto {
    year: string;
}
export declare const fetchmonths: (year: String) => any[];
