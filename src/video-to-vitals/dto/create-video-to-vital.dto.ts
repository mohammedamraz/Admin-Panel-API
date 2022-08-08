import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, isNotEmpty, IsOptional, IsString } from "class-validator";

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
        @IsOptional()
        fedo_score:boolean;
        @IsOptional()
        logo_image:string;
}


export class UpdateImageDTO {
        logo_image: string;
    }