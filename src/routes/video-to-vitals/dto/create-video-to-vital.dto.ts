import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsAlphanumeric, IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

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
    organization_mobile: phoneNumber;
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
    product_id: number;
    id:number;
    status:string;
    total_tests:number;
    application_id:string;

}
export class OrgDTO {
    @IsNotEmpty()
    @IsString()
    organization_name: string;
    @IsString()
    @IsEmail()
    organization_email: string;
    @IsPhoneNumber()
    organization_mobile: phoneNumber;
}

export class RegisterUserDTO {
	fedoApp: string;
	// @IsNotEmpty()
	email: string;
	@IsNotEmpty()
	password: string;
	username: string;
    ConfirmationCode: string;
}

export class EmailConfirmationDTO {
	@IsOptional() @IsString() fedoApp: string;
	@IsNotEmpty() @IsString() username: string;
	@IsNotEmpty() @IsString() password: string;
    email:string;
	// @Optional()
     ConfirmationCode: string;
}

export const makeuserRegistrationFormat = (registerUserDTO:RegisterUserDTO ): RegisterUserDTO => {
	const data = {
	  fedoApp: registerUserDTO.fedoApp,
	  email: registerUserDTO.email,
	  password: registerUserDTO.password,
	  username:registerUserDTO.username	  
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
    @IsOptional()
    @IsEmail()
    organization_email: string;
    @IsOptional()
    @IsPhoneNumber()
    organization_mobile: phoneNumber;
    @IsOptional()
    url: string;
    @IsOptional()
    start_date: Date;
    @IsOptional()
    end_date: Date;
    @IsOptional()
    fedo_score: boolean;
    @IsOptional()
    logo: string;
    @IsOptional()
    pilot_duration: number;
    org_id:number;
    
}

export class UserDTO {
    id:number;
    user_name: string;
    designation: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsPhoneNumber()
    mobile: phoneNumber;
    organization_name:string;
    product_name:string;
    product_id:number;
    third_party_org_name:string;
    password:string;
    org_id:number;
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
    mobile: phoneNumber;

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
    first_party_company?:string;
    third_party_company?:string;

}


export class LoginUserPasswordCheckDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    password: string;
    

}