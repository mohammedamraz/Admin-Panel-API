import { IsNotEmpty } from "class-validator";




export class XAPIKey {
    @IsNotEmpty()
    'x-api-key': string;
}


export class StatusDTO{
    id:number;
    // @IsNotEmpty()
    customer_id:any;
    // @IsNotEmpty()
    tenant_id:number;
    // @IsNotEmpty()
    scan_id:string;
    message:string;
    // @Optional()
    status:number;
    client_id:string;
    test_time:string;
    test_date:string;
    org_id:number;
    // date: string;
    // d:string;
   

    constructor(s?: Partial<StatusDTO>){
        this.customer_id = s?.customer_id || '';
        this.tenant_id= s?.tenant_id || 0;
        this.scan_id= s?.scan_id || '';
        this.message= s?.message || '';
        this.status= s?.status || 0;
        this.client_id = s?.client_id || '';
        this.test_time = s?.test_time || '';
        this.test_date=s?.test_date || '';
        this.org_id= s?.org_id || 0;
       
    }
}


export class OrganisationDTO{
    organisation_id:number;
    user_id:number;
    tenant_id:number;
}

export class VitalsDTO{
// @IsNotEmpty()
id:number;
status:number;
message:string;
// @Optional()
heart_rate:number;
rbs:number;
hemoglobin:number;
stress_level:number;
bmi:number;
smoker:string;
hrv_sdnn:number;
respiration_rate:number;
systolic:number;
diastolic:number;
blood_oxygen:number;
age_range:string;
gender:string;
org_id:number;
user_id:number;
product_id:number;
event_mode:boolean;
name:string;
city:string;
username:string;
for_whom:string;
ecg_url:string;
app_name:string;
media_name:string;
viu_user;string;
pdf_location:string;
fedo_score_id:string;
facial_precision:string;
mobile:string;
test_time:string;
version_id:number;
video_location:string;
client_id:string;
tenant_id:string;
tests:number;
status_code:number;
vitals_id: string;
policy_number:string;



constructor(v?: Partial<VitalsDTO>){
    this.status = v?.status || 0;
    this.message = v?.message || '';
    this.heart_rate = v?.heart_rate || 0;
    this.rbs = v?.rbs || 0;
    this.hemoglobin = v?.hemoglobin || 0;
    this.stress_level = v?.stress_level || 0;
    this.bmi = v?.bmi || 0;
    this.smoker = v?.smoker || '';
    this.hrv_sdnn = v?.hrv_sdnn || 0;
    this.respiration_rate = v?.respiration_rate || 0;
    this.systolic = v?.systolic || 0;
    this.diastolic = v?.diastolic || 0;
    this.blood_oxygen = v?.blood_oxygen || 0;
    this.age_range = v?.age_range || '' ;
    this.gender = v?.gender || '';
   
}
}