// export class CreateThirdPartyOrganizationDto {
//     // id:number;
//     tpa_name: string;
// }


// export class UpdateThirdPartyOrganizationJunctionDto {
//     // id:number;
//     tpa_id: string;
//     org_id: string
// }

export class ProductTestsDto {
    id?:number;
    product_id?: string;
    org_id?:string;
    user_id?:string;
    tests?:number;
    test_date?:string;
    event_mode?:boolean;
    period? :string;

}
