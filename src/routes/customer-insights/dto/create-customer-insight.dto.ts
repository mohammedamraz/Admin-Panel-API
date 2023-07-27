import { integer } from "@deepkit/type";
import { IsOptional } from "class-validator";

export class CreateCustomerInsightDTO { 
    @IsOptional()
    created_date : Date;
    @IsOptional()
    updated_date : Date;
    @IsOptional()
    created_time : any;
    @IsOptional()
    updated_time : any;
    @IsOptional()
    scan_success : any;
    @IsOptional()
    total_attempts : integer;
    @IsOptional()
    total_clicks : integer;
    @IsOptional()
    level_id : integer;
    @IsOptional()
    customer_id : any;
    @IsOptional()
    scan_id : any;
    @IsOptional()
    vitals_id : any;
    @IsOptional()
    org_id : any;
    @IsOptional()
    product_id : any;
    @IsOptional()
    user_id : any;
    @IsOptional()
    application_id : any;
}

export enum Type{
    'attempts' = 'attempts',
    'clicks' = 'clicks'
}

export class QueryParamsDto{
    type : Type
}