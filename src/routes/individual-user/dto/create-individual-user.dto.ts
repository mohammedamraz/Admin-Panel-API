// import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateIndividualUserDto {

  // @IsNotEmpty()
  // @IsString()
  name: string;
}

export class CreateIndividualReferenceDto {

  // @IsNotEmpty()
  // @IsString()
  id?: number;
  unique_id? : string;
  viu_id?: string;
}



export class MobileNumberDtO {

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: String;
}

export class MobileNumberAndOtpDtO {
  // @IsNotEmpty()
  // @IsPhoneNumber()
  phone_number: String;

  @IsNotEmpty()
  otp: number;
}

export class UpdateUserDto {

  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  // @IsPhoneNumber()
  @IsOptional()
  phone_number: String;
  @IsOptional()
  @IsString()
  // @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  gender: string;
  @IsOptional()
  @IsNumber()
  age: number;
  // @IsNumber()
  @IsOptional()
  attempts: number
}


export class EmailOtpDto {
  email: string;
  otp: number;
  name?: string;
}

export class FreeQuotaExhaustedDto {
  email: string;
  name: string;
  mobile: string;
  gender: string;
  age: string;
}

export class QueryParamsDto {

  // @IsOptional()
  // @IsEnum(Type)
  // type: Type;
  // @IsOptional()
  // @IsNotEmpty()
  // url: string;
  product_id? : string;
  @IsNotEmpty()
  @IsOptional()
  page: number;
  @IsNotEmpty()
  @IsOptional()
  per_page: number;
  is_deleted?:boolean
}

export class FetchIndividualUserData {
  email? : string;
  name? : string;
  mobile? : string;
  gender? : string;
  age? : string;
  phone_number? : string;
  attempts? : string;
  fedo_score? : string;
  id? : number;
  is_verified? : string;
  product_id? : string;
  unique_id? : string;
}