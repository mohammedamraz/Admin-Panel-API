import { IsNotEmpty } from "class-validator";

export class CreateThirdPartyOrganizationDto {
    // id:number;
    @IsNotEmpty()
    tpa_name: string;
    id?: string;
    org_id?: string;
    api_url_status? : any;
    api_url_vitals? : any;
    is_batchprocess? : boolean;
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

export class AuthAPIDto {
    fullName?: any;
    policy_number? : any;
}





export class UpdateThirdPartyOrganizationJunctionDto {
    // id:number;
    tpa_id: string;
    org_id: string;
    tpa_name:string;
    api_url_status? : any;
    api_url_vitals? : any;
    is_batchprocess? : boolean;
}

// export class CreateThirdPartyOrganizationDto {
//     id:number;
//     product_name: string;
// }
