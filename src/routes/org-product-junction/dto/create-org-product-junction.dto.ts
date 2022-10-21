import { IsOptional, IsEnum } from "class-validator";
import { Is_active } from "src/routes/sales/dto/create-sale.dto";

export class CreateOrgProductJunctionDto {
    id: number;
    product_id: number;
    org_id: number;
    start_date: Date;
    end_date: Date;
    pilot_duration: number;
    fedo_score: boolean;
    status:Boolean;
    stage:string;
}


export class ZQueryParamsDto {

    @IsOptional()
    name?: string;

    @IsOptional()
    date?: string;

    @IsOptional()
    number_of_pages?: number;

    @IsOptional()
    number_of_rows?: number;

    @IsOptional()
    @IsEnum(Is_active)
    is_active: Is_active;
}