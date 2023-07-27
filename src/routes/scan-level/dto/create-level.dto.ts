import { IsNotEmpty, IsString } from "class-validator";

export class CreateLevelDTO {
    @IsNotEmpty()
    @IsString()
    level : string;
}