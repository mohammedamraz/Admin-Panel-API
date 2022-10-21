import { IsNotEmpty } from "class-validator";

export class CreateThirdPartyOrganizationDto {
    // id:number;
    @IsNotEmpty()
    tpa_name: string;
    id?: string;
    org_id: string;
}


export class UpdateThirdPartyOrganizationJunctionDto {
    // id:number;
    tpa_id: string;
    org_id: string;
    tpa_name:string;
}

// export class CreateThirdPartyOrganizationDto {
//     id:number;
//     product_name: string;
// }
