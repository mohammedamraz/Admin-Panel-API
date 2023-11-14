




export class StatusDTO{
    id:number;
    customer_id:string;
    tenant_id:number;
    scan_id:string;
    message:string;
    status:number;
   

    constructor(s?: Partial<StatusDTO>){
        this.customer_id = s?.customer_id || '';
        this.tenant_id= s?.tenant_id || 0;
        this.scan_id= s?.scan_id || '';
        this.message= s?.message || '';
        this.status= s?.status || 0;
       
    }
}

export class VitalsDTO{
id:number;
status:number;
message:string;
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
   
}
}