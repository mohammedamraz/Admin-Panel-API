import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsAlphanumeric, IsBoolean, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateOrganizationDto {
    @IsNotEmpty()
    @IsString()
    organization_name: string;
    @IsNotEmpty()
    @IsString()
    admin_name: string;
    @IsNotEmpty()
    @IsString()
    designation: string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    organization_email: string;
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    organization_mobile: String;
    @IsNotEmpty()
    @IsString()
    url: string;
    start_date: Date;
    end_date: Date;
    @IsOptional()
    fedo_score: boolean;
    @IsOptional()
    logo: string;
    pilot_duration: number;
    product_name: string;
    product_id: string;
    id: number;
    status: string;
    total_tests: number;
    application_id: string;
    stage?: string;
    org_id: string;
    productaccess_web?: boolean;
    productaccess_mobile?: boolean;
    web_fedoscore?: boolean;
    web_url?: string;
    type?: string;
    event_mode?:string;
    password? : any;
    is_register : boolean ;
}

export class UpdateWholeOrganizationDto {
    // @IsNotEmpty()
    // @IsString()
    organization_name: string;
    // @IsNotEmpty()
    // @IsString()
    admin_name: string;
    // @IsNotEmpty()
    // @IsString()
    designation: string;
    // @IsNotEmpty()
    // @IsString()
    // @IsEmail()
    organization_email: string;
    // @IsNotEmpty()
    // @IsString()
    // @IsPhoneNumber()
    organization_mobile: phoneNumber;
    // @IsNotEmpty()
    // @IsString()
    url: string;
    start_date: Date;
    end_date: Date;
    @IsOptional()
    fedo_score: boolean;
    @IsOptional()
    logo: string;
    pilot_duration: number;
    product_name: string;
    product_id: string;
    product_junction_id: string;
    id: number;
    status: string;
    total_tests: number;
    application_id: string;
    stage?: string;
    org_id: string;
    productaccess_web?: boolean;
    productaccess_mobile?: boolean;
    web_fedoscore?: boolean;
    web_url?: string;
    type?: string;
    updated_date?: Date;
    event_mode?:string;
}

export class OrgDTO {
    @IsNotEmpty()
    @IsString()
    organization_name: string;
    @IsString()
    @IsEmail()
    organization_email: string;
    @IsString()
    @IsPhoneNumber()
    organization_mobile: String;
}

export class RegisterUserDTO {
    fedoApp?: string;
    // @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    password: string;
    username: string;
    ConfirmationCode?: string;
}

export class EmailConfirmationDTO {
    @IsOptional() @IsString() fedoApp: string;
    @IsNotEmpty() @IsString() username: string;
    @IsNotEmpty() @IsString() password: string;
    email: string;
    // @Optional()
    ConfirmationCode: string;
}

export const makeuserRegistrationFormat = (registerUserDTO: RegisterUserDTO): RegisterUserDTO => {
    const data = {
        fedoApp: registerUserDTO.fedoApp,
        email: registerUserDTO.email,
        password: registerUserDTO.password,
        username: registerUserDTO.username
    }
    return <RegisterUserDTO><unknown>data
}
export class UpdateOrganizationDto {

    @IsOptional()
    organization_name: string;
    @IsOptional()
    admin_name: string;
    @IsOptional()
    designation: string;
    // @IsOptional()
    // @IsEmail()
    // organization_email: string;
    @IsOptional()
    @IsPhoneNumber()
    organization_mobile: phoneNumber;
    // @IsOptional()
    // url: string;
    // @IsOptional()
    // start_date: Date;
    // @IsOptional()
    // end_date: Date;
    // @IsOptional()
    // fedo_score: boolean;
    // @IsOptional()
    // logo: string;
    // @IsOptional()
    // pilot_duration: number;
    // org_id:number;

}



export class UserDTO {
    id?: number;
    user_name: string;
    designation: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsPhoneNumber()
    mobile: String;
    organization_name:string;
    product_name?:string;
    product_id?:number;
    third_party_org_name?:string;
    password?:string;
    application_id?:string;
    org_id:number;
    tests?:any;
    type? :any;
    is_register? : boolean
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
    org_id: number;
    total_tests: number;
    is_editable: boolean;
    user_id: number;
    application_id: string;
    // org_id:number;
}

export class VitalUserDTO {
    id: number;
    user_name: string;
    designation: string;
    email: string;
    mobile: String;
    organization_name:string;
    product_name:string;
    org_id:number;
    product_id:number;

}

export class UpdateUserDTO {

    @IsOptional()
    user_name: string;
    @IsOptional()
    designation: string;
    @IsOptional()
    @IsEmail()
    email: string;
    @IsOptional()
    @IsPhoneNumber()
    mobile: String;
    product_name?:string;
    product_id?:any;
    product_junction_id? : any;
    third_party_org_name?:string;
    password?:string;
    application_id?:string;
    org_id?:number;
    tests?:any;
    type? :any;
    is_register? : boolean

}

export class LoginUserDTO {

    // @IsNotEmpty()
    // @IsEmail()
    email?: string;
    @IsNotEmpty()
    // @IsAlphanumeric()
    password: string;
    fedoApp: string;
    //   @IsNotEmpty()
    username: string;
    first_party_company?: string;
    third_party_company?: string;

}


export class LoginUserPasswordCheckDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    password: string;


}

export enum Type {
    "latest" = "latest",
    "active" = "active",
}
export class QueryParamsDto {

    @IsOptional()
    @IsEnum(Type)
    type: Type;
    @IsOptional()
    @IsNotEmpty()
    url: string;
    @IsNotEmpty()
    @IsOptional()
    page: number;
    @IsNotEmpty()
    @IsOptional()
    per_page: number;
    is_deleted?:boolean
}

export enum Product {
    "hsa" = "hsa",
    "vitals" = "vitals",
    "ruw" = "ruw"

}

export enum Active {
    "active" = "active"

}

export class ProductDto {
    @IsNotEmpty()
    @IsEnum(Product)
    product: Product
    @IsOptional()
    @IsEnum(Active)
    status: Active
}



export const CONVERTINNUMBER = {
    hsa: 1,
    vitals: 2,
    ruw: 3
}

export const CONVERTINACTIVE = {
    active: "Active"
}


export enum Typo {
    "latest" = "latest"
}


export class UserParamDto {
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Typo)
    type: Typo
    @IsNotEmpty()
    @IsOptional()
    page: number;
    @IsNotEmpty()
    @IsOptional()
    per_page: number;
    product_id?:number;
    is_deleted?:boolean

}