
import { IsAlphanumeric, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Periodicity } from 'src/routes/sales/dto/create-sale.dto';

export class LoginDTO {
  fedoApp: string;
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDTO {
  @IsOptional() ClientId: string;
	@IsNotEmpty()
	@IsAlphanumeric()
	username: string;
	fedoApp: string;
}

export class ConfirmForgotPasswordDTO {
  @IsOptional() ClientId: string;
	@IsOptional() ConfirmationCode: string;
	@IsNotEmpty() password: string;
	@IsNotEmpty() username: string;
	@IsOptional() @IsString() fedoApp: string;
}

export enum PeriodicityAdmin {
  MONTH = 'monthly',
  QUARTER = 'quarterly',
  YEARLY = 'yearly',
}

export class PeriodRange {
  @IsNotEmpty()
  @IsEnum(PeriodicityAdmin)
  period: PeriodicityAdmin;
}

export const PERIODADMIN = {
  month: 1,
  quarter: 3,
  year: 12
}
export const formatDate = (date) => {
  const DATE = new Date(date);
  let month = '' + (DATE.getMonth() + 1);
  let day = '' + DATE.getDate();
  const YEAR = DATE.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [YEAR, month, day].join('-');
}
export const fetchDAte = (date: Date, period: number) =>{
  const DATE = new Date(date);
   return {
     'from': formatDate(date.setMonth((date.getMonth()) - period)), 
     'to': formatDate(DATE)}
}

export enum Stateness {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ALL = 'all',
}

export const STATE = {
  active: true,
  inactive: false,
  ALL: undefined
}
export class State {
  @IsNotEmpty()
  @IsEnum(Stateness)
  state: Stateness;

  @IsNotEmpty()
  @IsEnum(Periodicity)
  period: Periodicity;
}

export const makeStateFormat = (state: State) => STATE[state.state];

export const makeEarningDuesFormat = (name: string, earning: number, dues: number, signup: number) => ({
  name: name,
  earnings: earning,
  dues: dues,
  signups: signup
});

export const averageSignup = (totalSalesPartner: number, totalSignups: number) => (totalSignups / totalSalesPartner);

export const applyPerformance =(salesPartner: any[], signups: number) => salesPartner.map(salesPartner => ({...salesPartner, 
  performance: salesPartner.signups < (signups/100)*25 ? -1 : salesPartner.signups > (signups/100)*75 ? 2 : 1 }));