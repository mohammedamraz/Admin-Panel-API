import { IsNotEmpty } from "class-validator";

export class CreateThirdPartyOrganizationDto {
    // id:number;
    @IsNotEmpty()
    tpa_name: string;
    id?: string;
    org_id?: string;
    api_url? : any;
}

export class ParamsDto {
    // id:number;
    // @IsNotEmpty()
    // tpa_name: string;
    id?: string;
    org_id?: string;
    // api_url? : any;
}

export class RequestToAPIDto {
    clientId?:any;
    // @IsNotEmpty()
    customerID?: any;
    scanID?: any;
    status?: any;
    message? : any;
}





export class UpdateThirdPartyOrganizationJunctionDto {
    // id:number;
    tpa_id: string;
    org_id: string;
    tpa_name:string;
    api_url? : any;
}

// export class CreateThirdPartyOrganizationDto {
//     id:number;
//     product_name: string;
// }
