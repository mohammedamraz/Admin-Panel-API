import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsAlphanumeric, IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";


export class CreateProfileInfoDTO {
    // id:number;
    name: string;

    age: string;
    // @IsNotEmpty()
    // @IsEmail()
    gender: string;
    // @IsNotEmpty()
    // @IsPhoneNumber()
    application_id: string;
    city:string;
    total_tests:string;
    is_editable:boolean;
    user_id:string;
    // password:string;
    org_id:number;
    product_id?:number;
}


export class UserProfileDTO {
    // id:number;
    name: string;
    age: number;
    // @IsNotEmpty()
    // @IsEmail()
    city: string;
    // @IsNotEmpty()
    // @IsPhoneNumber()
    gender: phoneNumber;
    org_id:number;
    total_tests:number;
    is_editable:boolean;
    user_id:number;
    application_id:string;
    // org_id:number;
}

export class VitalUserDTO {
    id:number;
    user_name: string;
    designation: string;
    email: string;
    mobile: phoneNumber;
    organization_name:string;
    product_name:string;
    org_id:number;
    product_id:number;

}

export class ZQueryParamsDto {

    @IsOptional()
    user_id?: string;

    @IsOptional()
    org_id?: string;

  
}

