import { IsNotEmpty, IsString } from "class-validator";

export class CreateAppVersionDTO {
    @IsNotEmpty()
    @IsString()
    version : string;
}