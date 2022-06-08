
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

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

export enum Periodicity {
  MONTH = 'month',
  QUARTER = 'quarter',
  YEARLY = 'year',
}

export class PeriodRange {
  @IsNotEmpty()
  @IsEnum(Periodicity)
  period: Periodicity;
}

export const PERIOD = {
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

