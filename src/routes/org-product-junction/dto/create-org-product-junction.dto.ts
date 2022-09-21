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
