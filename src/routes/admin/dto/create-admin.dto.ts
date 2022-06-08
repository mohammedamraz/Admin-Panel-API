import { ArrayMinSize, IsNotEmpty, IsPhoneNumber, ValidateNested } from 'class-validator';
import { phoneNumber } from 'aws-sdk/clients/importexport';
import { Type } from 'class-transformer';

export class MobileNumberDtO {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: phoneNumber;
  
  @IsNotEmpty()
  commission:number;
}

export class MobileNumberAndOtpDtO {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: phoneNumber;

  @IsNotEmpty()
  otp: number;
}

export class requestDto {
  @IsNotEmpty()
  message: string[];
}

export class ParamDto {

  @IsNotEmpty()
  mobileNumber: string;
}

export class User {
	fedo_id:string;
	created_date: string;
	updated_date: string;
	is_active: string;
	email: string;
	secret_key: string;
	account_id: number;
	demographic_id: string;
	channel_id: string;
	pan_id: string;
	aadhaar_id: string;
	userreference_id: string;
	kycschedule: string;
	mobile:phoneNumber;

}

export class AccountZwitchResponseBody {

  id : string;
  object : string;
  type : string;
  title: string;
  name : string;
  mobile_number : string;
  account_number: string;
  ifsc_code: string;
  bank_customer_id: string;
  email : string;
  bank_name: string;
}

export class sendEmailOnIncorrectBankDetailsDto {
  name: string;
  email: string;
  @IsNotEmpty()
  message: string[];

  request_id: string;
}

export class createAccount {

  id: string;
  created_date : string;
  updated_date : string;
  object : string;
  type : string;
  account_number : string;
  ifsc_code : string;
  bank_name : string;
  vpa : string;
  zwitch_id: string;
  agent_id: string;
  redirection_url: string;
  cost_saving:string;
  virtual_account_id:number;
  bank_customer_id: string;
  savings_beneficiary_id:string
  partner_id:number;
  sales_code: string;
  fedo_id: string;
  userreference_id:string
}

export class createPaidAmountDto {
  @IsNotEmpty() paid_amount: number;
  @IsNotEmpty() salesCode:string; 
  account_holder_name:string;
  account_number:string;
  ifsc_code:string;
  bank:string;
}

export class createPaid {
  @ValidateNested({ each: true })
  @Type(() => createPaidAmountDto)
  @ArrayMinSize(1)
  @IsNotEmpty()
  data : createPaidAmountDto[];
}
