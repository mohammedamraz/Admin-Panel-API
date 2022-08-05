import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class CreateVideoToVitalDto {
        @IsNotEmpty()
        @IsString()
        organization_name: string;
        @IsNotEmpty()
        @IsString()
        organization_admin_name:string;
        @IsNotEmpty()  
        @IsString()
        @IsEmail()
        organization_admin_email:string;
        @IsNotEmpty()
        @IsString()
        @IsMobilePhone()
        organization_admin_mobile:string;
        fedo_score:boolean;
        logo_image:string;
}


