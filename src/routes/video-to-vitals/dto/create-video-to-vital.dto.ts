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
    // @IsNotEmpty()
    // @IsString()
    url: string;
    start_date: Date;
    end_date: Date;
    @IsOptional()
    fedo_score: [];
    @IsOptional()
    logo: string;
    pilot_duration: Array<string>;
    product_name: string;    
    product_id: Array<string>;
    id: number;
    status: string;
    total_tests: number;
    application_id: string;
    stage?: string;
    org_id: string;
    productaccess_web?: Array<string>;
    productaccess_mobile?: Array<string>;
    web_fedoscore?: Array<string>;
    web_url?: Array<string>;
    type?: string;
    event_mode?:Array<string>;
    password? : any;
    is_register? : boolean ;
    enable_kiosc? : boolean;
    kiosc_user? : any;
    is_read? : boolean;
    is_application_number? : boolean;
    // is_read? : boolean;
    is_web? : boolean;
    attempts? : number;
    is_pilot_duration? : boolean;
    // org_details? : any;
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
    country? : any;
    zip? : any;
    state? : any;
    city? : any;
    address? : any;
    attempts? : any
    is_pilot_duration? : boolean
    is_change? : boolean
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
    product_id?:Array<string>;
    third_party_org_name?:string;
    password?:string;
    application_id?:string;
    org_id:number;
    tests?:any;
    type? :any;
    is_register? : boolean;
    total_test? : any;
    role? : Array<string>;
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
    role ? : any;
    attempts? :any;

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
    "expired" = "expired",
    '' =  ''
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
    is_deleted?:boolean;
    is_web? : boolean ;
    is_read? : boolean ;
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

export const CONVERTPILOTSTATUS = {
    active: "Active",
    expired: "Expired"
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

export const format_user=(res)=>{
    let data=
    {user_name:res.user_name,
    tpa_name:res.tpa_name || null,
    email:res.email,
    mobile:res.mobile,
    org_id:res?.org_id,
    organization_name:res?.organization_name ,
    designation:res.designation,
    application_id:res.application_id,
    is_register:res?.is_register|| false,
}

    return data
    
}

export const format_user_update =(res,doc)=>{
    let data=
    {user_name:res.user_name? res.user_name : doc.user_name,
    tpa_name:res.tpa_name ? res.tpa_name :null,
    email:res.email ? res.email :doc.email,
    mobile:res.mobile ? res.mobile : doc.mobile,
    org_id:res?.org_id ? res?.org_id :doc?.org_id,
    organization_name:res?.organization_name ? res?.organization_name : doc?.organization_name ,
    designation:res.designation ? res.designation : doc.designation,
    application_id:res.application_id ? res.application_id : doc.application_id,
    is_register:res?.is_register ? res?.is_register : doc?.is_register,
    is_deleted:res.is_deleted?.toString() ? res?.is_deleted : doc?.is_deleted,
}

    return data
    
}

export const format_organisation=(res)=>{
    let data=
    {organization_name:res.organization_name,
    admin_name:res.admin_name,
    organization_email:res.organization_email,
    organization_mobile:res.organization_mobile,
    logo:res?.logo || null,
    // attempts:res?.attempts || 0,
    designation:res.designation,
    url:res.url,
    stage:res?.stage || null,
    application_id:res.application_id,
    is_register:res?.is_register|| false,
    type:res?.type || 'orgAdmin',
    country:res?.country || null,
    state:res?.state || null,
    zip:res?.zip || null,
    city:res?.city || null,
    address:res?.address || null,
    is_web : res.is_web ? res.is_web : false, 
    is_read : res.is_read ? res.is_read : false, 
}

    return data
    
}

export const format_organisation_update=(res,doc)=>{
    let data=
    {organization_name:res.organization_name? res.organization_name : doc.organization_name,
    admin_name:res.admin_name?res.admin_name:doc.admin_name,
    organization_email:res.organization_email?res.organization_email:doc.organization_email,
    organization_mobile:res.organization_mobile?res.organization_mobile:doc.organization_mobile,
    logo:res?.logo?res?.logo:doc?.logo,
    attempts:res?.attempts?res?.attempts:doc?.attempts,
    designation:res.designation?res.designation:doc.designation,
    url:res.url?res.url:doc.url,
    stage:res?.stage?res?.stage:doc?.stage ,
    application_id:res.application_id?res.application_id:doc.application_id,
    is_register:res?.is_register?res?.is_register:doc?.is_register,
    type:res?.type?res?.type:doc?.type,
    country:res?.country?res?.country:doc?.country,
    state:res?.state?res?.state:doc?.state,
    zip:res?.zip?res?.zip:doc?.zip,
    city:res?.city?res?.city:doc?.city,
    address:res?.address?res?.address:doc?.address,
    updated_date:res.updated_date
}
console.log("dtaaa",data)
return data
    
}

export const format_org_product_juction=(res,index,id)=>{
    console.log("format_org_product_juction() const" ,res ,index, id)
    const tomorrow = new Date();
    let end_date = JSON.parse(res.is_pilot_duration[index]) ? (new Date(tomorrow.setDate(tomorrow.getDate() + Number(res.pilot_duration[index])))) : (new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]) ;
   let data={ org_id: id, 
        end_date: end_date, 
        pilot_duration: res.pilot_duration[index] ? res.pilot_duration[index] : null ,
        event_mode: res.event_mode ? res.event_mode[index] : 0, 
        product_id: res.product_id[index], 
        fedoscore: res.fedo_score[index], 
        web_access: res.productaccess_web ? res.productaccess_web[index] : false ,  
        is_pilot_duration: JSON.parse(res.is_pilot_duration[index]) ? res.is_pilot_duration[index] : false ,  
        is_application_number: JSON.parse(res.is_application_number[index]) ? res.is_application_number[index] : false ,  
        ios_access: res.ios_access ? res.ios_access[index] : false, 
        enable_kiosk: res.enable_kiosk ? res.enable_kiosk[index] : false, 
        kiosk_user: res.kiosk_user ? res.kiosk_user[index] : null, 
        attempts: res.attempts[index] ? res.attempts[index] : null, 
        mobile_access: res.productaccess_mobile ? res.productaccess_mobile[index] : false, 
        status: "Active",
    }
    return data
}


export const format_org_product_juction_update=(res,index,id)=>{
    console.log("format_org_product_juction_update() const" ,res ,index, id)
    const tomorrow = new Date();
    let end_date = JSON.parse(res.is_pilot_duration[index]) ? (new Date(tomorrow.setDate(tomorrow.getDate() + Number(res.pilot_duration[index])))) : (new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]) ;
   let data={ org_id: id, 
        end_date: end_date, 
        pilot_duration: res.pilot_duration[index] ? res.pilot_duration[index] : null ,
        event_mode: res.event_mode ? res.event_mode[index] : 0, 
        product_id: res.product_id[index], 
        fedoscore: res.fedo_score[index], 
        web_access: res.productaccess_web ? res.productaccess_web[index] : false ,  
        is_pilot_duration: JSON.parse(res.is_pilot_duration[index]) ? res.is_pilot_duration[index] : false ,  
        is_application_number: JSON.parse(res.is_application_number[index]) ? res.is_application_number[index] : false ,  
        ios_access: res.ios_access ? res.ios_access[index] : false, 
        enable_kiosk: res.enable_kiosk ? res.enable_kiosk[index] : false, 
        kiosk_user: res.kiosk_user ? res.kiosk_user[index] : null, 
        // attempts: res.attempts ? res.attempts[index] : doc.attempts, 
        mobile_access: res.productaccess_mobile ? res.productaccess_mobile[index] : false, 
        status: "Active",
    }
    return data
}

