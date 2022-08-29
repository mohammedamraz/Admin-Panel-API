import { phoneNumber } from "aws-sdk/clients/importexport";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateIndividualUserDto {

  // @IsNotEmpty()
  // @IsString()
  name: string;
}

export class MobileNumberDtO {

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: phoneNumber;
}

export class MobileNumberAndOtpDtO {
  // @IsNotEmpty()
  // @IsPhoneNumber()
  phone_number: phoneNumber;

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
  phone_number: phoneNumber;
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
}

export class FreeQuotaExhaustedDto {
  email: string;
  name: string;
  mobile: string;
  gender: string;
  age: string;
}