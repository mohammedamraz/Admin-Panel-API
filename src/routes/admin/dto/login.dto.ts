
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Periodicity } from 'src/routes/sales/dto/create-sale.dto';

export class LoginDTO {
  fedoApp: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDTO {
  fedoApp: string;
  @IsNotEmpty()
  username: string;
}

export class ConfirmForgotPasswordDTO {
  fedoApp: string;
  @IsOptional()
  ConfirmationCode: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}

export enum PeriodicityAdmin {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEARLY = 'year',
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
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
  return [year, month, day].join('-');
}
export const fetchDAte = (date: Date, period: number) =>{
  let d = new Date(date);
   return {
     'from': formatDate(date.setMonth((date.getMonth()) - period)), 
     'to': formatDate(d)}}

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

export const makeStateFormat = (state: State) => STATE[state.state]