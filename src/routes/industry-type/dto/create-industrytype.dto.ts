import { IsNotEmpty, IsString } from "class-validator";

export class CreateIndustryTypeDTO {
    @IsNotEmpty()
    @IsString()
    industry : string;
}