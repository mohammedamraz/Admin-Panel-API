import { ArrayMinSize, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
// import { phoneNumber } from 'aws-sdk/clients/importexport';
import { Type } from 'class-transformer';
import { BadRequestException, Logger } from '@nestjs/common';
import { CreateSalesJunction } from 'src/routes/sales/dto/create-sale.dto';

export class MobileNumberDtO {

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: String;
}

export class MobileDtO {

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: String;

  @IsNotEmpty()
  @IsNumber()
  commission: number;
}

export class MobileNumberAndOtpDtO {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: String;

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
  fedo_id: string;
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
  mobile: String;

}

export class AccountShort{
  name: string;
  date: string;
  mobile: string;
}

export class AccountZwitchResponseBody {

  id: string;
  object: string;
  type: string;
  title: string;
  name: string;
  mobile_number: string;
  account_number: string;
  ifsc_code: string;
  bank_customer_id: string;
  email: string;
  bank_name: string;
}

export class sendEmailOnIncorrectBankDetailsDto {
  name: string;
  email: string;
  @IsNotEmpty()
  message: string[];

  request_id: string;
}

export class sendEmailOnCreationOfDirectSalesPartner {
  organisation_name? : string;
  name?: string;
  email?: string;
  // @IsNotEmpty()
  message?: string[];

  request_id?: string;
  toAddresses?: string;
  mobile?:string;
  
  city?:string
  messages?:string
  existingcustomer?:string;

}

export class sendEmailOnCreationOfOrgAndUser {
  organisation_name? : string;
  organisation_admin_name? : string;
  organisation_admin_email? : string;
  organisation_admin_mobile? : string;
  designation?:string;
  fedo_app?: string;
  pilot_duration? : number;
  name?: string;
  url? : string;
  email?: string;
  gender?  : string;
  age?: string;
  // @IsNotEmpty()
  application_id?:string;
  org_junction_id?:string;
  mobile?:string;
  expired_date?:string;
  org_id? : string;
  user_id? :string;
  city? :any;
  state? : any;
  product_name? : any;
  content? : any;
  fedoscore_content? : any;
  riskclassification_content? : any;
  diseaserisk_content? : any;
  test_date? : any;
  batch_id? : any;
  customer_id? :any;
  scan_id?: any;
  client_id?: any;
  is_questioannire? : any;
  logo? :any
  
  

}

export class PasswordResetDTO {
  
  user_name?: string;
  email?:string;
  url? : string;
  
}
export class createAccount {

  id: string;
  created_date: string;
  updated_date: string;
  object: string;
  type: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  vpa: string;
  zwitch_id: string;
  agent_id: string;
  redirection_url: string;
  cost_saving: string;
  virtual_account_id: number;
  bank_customer_id: string;
  savings_beneficiary_id: string
  partner_id: number;
  sales_code: string;
  fedo_id: string;
  userreference_id: string
}

export class createPaidAmountDto {
  @IsNotEmpty() @IsNumber() paid_amount: number;
  @IsNotEmpty() salesCode: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank: string;
}

export class createPaid {
  @ValidateNested({ each: true })
  @Type(() => createPaidAmountDto)
  @ArrayMinSize(1)
  @IsNotEmpty()
  data: createPaidAmountDto[];
}

export class YearMonthDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'Enter only 4 digit value of year, This is too short' })
  @MaxLength(4, { message: 'Enter only 4 digit value of year, This is too long' })
  year: string;
}

export class DateDTO extends YearMonthDto {

  @IsNotEmpty()
  @MinLength(2, { message: 'Enter only 2 digit value of month, This is too short' })
  @MaxLength(2, { message: 'Enter only 2 digit value of month, This is too long' })
  month: string;
}
export const fetchmonths = (year: string) => {
  Logger.debug(`fetchmonths() year: [${year}]`);

  let month = [];
  let i = 0;
  if (new Date().getFullYear() < parseInt(year)) { throw new BadRequestException("Invalid Year Selected") }
  if (new Date().getFullYear().toString() === year) {
    for (i = new Date().getMonth() + 1; i > 0; i--)
      month.push(i)
    return month
  }
  else {
    for (i = 12; i > 0; i--)
      month.push(i)
    return month
  }
}
export const fetchDues = (createSalesJunction: CreateSalesJunction[]) => {
  Logger.debug(`fetchDues() createSalesJunction: [${JSON.stringify(createSalesJunction)}]`);

  const due = createSalesJunction.reduce((acc, curr) => {
    const index = acc.findIndex(x => x.sales_code === curr.sales_code);
    index === -1 ? acc.push({ sales_code: curr.sales_code, dues: [curr.dues] }) : acc[index].dues.push(curr.dues);
    return acc
  }, []).map(salesCode => ({ sales_code: salesCode.sales_code, dues: salesCode.dues[salesCode.dues.length -1] }));

  return due.reduce((acc, curr) => acc += curr.dues, 0)
  
}
