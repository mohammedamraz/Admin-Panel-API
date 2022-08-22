import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVideoToVitalDto {
        @IsNotEmpty()
        @IsString()
        organization_name: string;
        @IsNotEmpty()
        @IsString()
        organization_admin_name:string;
        @IsNotEmpty()  
        @IsString()
        designation:string;
        @IsNotEmpty()  
        @IsString()
        @IsEmail()
        organization_admin_email:string;
        @IsNotEmpty()
        @IsString()
        @IsMobilePhone()
        organization_admin_mobile:string;
        @IsNotEmpty()
        @IsString()
        url:string;
        @IsNotEmpty()
        pilot_duration:number;
        @IsOptional()
        fedo_score:boolean;
        @IsOptional()
        logo_image:string;
}


export class UpdateImageDTO {
        logo_image: string;
    }


export class AddUserDTO{
        org_user_name:string;
        email:string;
        mobile:string;
        tests_myself:number;
        tests_others:number;
        total_tests:number
    }