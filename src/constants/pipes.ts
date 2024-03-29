import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform<any> {

  

  transform(value: any, metadata: ArgumentMetadata) {
    
    if(value!=undefined)Object.keys(value).map((res,index)=>{if(['product_id','pilot_duration','fedo_score','productaccess_web','productaccess_mobile','ios_access','product_id','product_junction_id','event_mode','enable_kiosk','role','is_application_number','is_pilot_duration','attempts','is_change','enable_questionnaire','enable_sms','enable_beta','is_heart_rate','is_stress','is_bmi','is_smoker','is_hrv','is_respiration','is_bp','is_spo2','is_ecg','is_cholesterol','is_dashboard','is_rbs','is_haemoglobin'].includes(res)) {value[res] =value[res]?.toString().split(",")||[]}
    else if(['kiosk_user'].includes(res)){value[res] =value[res]?.toString().split("],")||[]}
  });
   
    return value
  }
}