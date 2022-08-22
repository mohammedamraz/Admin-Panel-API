import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVideoToVitalDto {
        @IsNotEmpty()
        @IsString()
        organization_name: string;
        @IsNotEmpty()
        @IsString()
        admin_name:string;
        @IsNotEmpty()  
        @IsString()
        designation:string;
        @IsNotEmpty()  
        @IsString()
        @IsEmail()
        organization_email:string;
        @IsNotEmpty()
        @IsString()
        @IsMobilePhone()
        organization_mobile:string;
        @IsNotEmpty()
        @IsString()
        url:string;
        start_date: Date;
        end_date: Date;
        @IsOptional()
        fedo_score:boolean;
        @IsOptional()
        logo:string;
        pilot_duration: number
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