import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform<any> {

  

  transform(value: any, metadata: ArgumentMetadata) {
    
    if(value!=undefined)Object.keys(value).map((res,index)=>{if(['product_id','pilot_duration','fedo_score','productaccess_web','ios_access','product_id'].includes(res)) {value[res] =value[res]?.toString().split(",")||[]}});
   
    return value
  }
}