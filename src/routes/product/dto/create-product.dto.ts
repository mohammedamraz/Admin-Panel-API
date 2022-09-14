// export class CreateThirdPartyOrganizationDto {
//     // id:number;
//     tpa_name: string;
// }


// export class UpdateThirdPartyOrganizationJunctionDto {
//     // id:number;
//     tpa_id: string;
//     org_id: string
// }

export class CreateProductDto {
    id:number;
    product_name: string;
    web_url?:string;
    mobile_url?:string;
}
