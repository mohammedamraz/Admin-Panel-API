// export class CreateThirdPartyOrganizationDto {
//     // id:number;
//     tpa_name: string;
// }

import { IsOptional } from "class-validator";


// export class UpdateThirdPartyOrganizationJunctionDto {
//     // id:number;
//     tpa_id: string;
//     org_id: string
// }

export class ProductTestsDto {
    id?:number;
    product_id?: any;
    org_id?:any;
    user_id?:string;
    tests?:number;
    test_date?:string;
    test_end_date? : string;
    event_mode?:boolean;
    period? :string;
    name?: string;
    age?: string;
    gender?: string;
    city?: string;
    username?: string;
    for_whom?: string;
    heart_rate?: string;
    systolic?: string;
    diastolic?: string;
    stress?: string;
    haemoglobin?: string;
    respiration?: string;
    spo2?: string;
    hrv?: string;
    bmi?: string;
    smoker_accuracy?: string;
    vitals_id?: string;
    policy_number?: string;
    bp_status?: string;
    rbs?: string;
    ecg_url?: string;
    //  @IsNotEmpty()
    @IsOptional()
    page?: number;
    // @IsNotEmpty()
    @IsOptional()
    per_page?: number;
    viu_user? : any;
    pdf_location? : any
    version_id? : any;
}
