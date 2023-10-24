export class CreateUserProductJunctionDto {
    user_id?: number;
    org_id?:number;
    product_id?:number;
    total_tests:number;
    id?:number;
    attempts? : any;
    is_pilot_duration? : any;
    role ? : any;
    is_dashboard? : boolean
}
