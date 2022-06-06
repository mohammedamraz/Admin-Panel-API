import { IsNotEmpty, IsOptional } from 'class-validator';

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
