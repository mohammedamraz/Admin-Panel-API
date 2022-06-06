import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class EmailDTO {
	@IsNotEmpty()
	@IsArray()
	toAddresses: string[];
	@IsOptional()
	@IsArray()
	ccAddresses: string[];
	@IsOptional()
	@IsArray()
	bccAddresses: string[];
	@IsOptional()
	@IsArray()
	replyto: string[];
	@IsNotEmpty()
	subject: string;
}

export class TypeDTO{
	@IsNotEmpty()
	type:string;
	@IsNotEmpty()
	user_name:string;
	@IsNotEmpty()
	message:string;
}