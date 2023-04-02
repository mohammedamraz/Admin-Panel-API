import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { concatMap, lastValueFrom, map } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateUserProductJunctionDto } from './dto/create-user-product-junction.dto';
import { UpdateUserProductJunctionDto } from './dto/update-user-product-junction.dto';

const APP = "UserProductJunctionService"
@Injectable()
export class UserProductJunctionService {

  constructor(@DatabaseTable('user_product_junction')
  private readonly userProductJunctionDb: DatabaseService<CreateUserProductJunctionDto>){}

  createUserProductJunction(createUserProductJunctionDto:CreateUserProductJunctionDto){
    
   return this.userProductJunctionDb.save(createUserProductJunctionDto)
  }

  fetchUserProductJunctionDataByOrgId(org_id:number){
    return this.userProductJunctionDb.find({org_id:org_id}).pipe(
      map(doc=>doc)
    )
  }

  fetchUserProductJunctionDataByProductId(product_id:number){
    return this.userProductJunctionDb.find({product_id:product_id}).pipe(
      map(doc=>doc)
    )
  }

  fetchUserProductJunctionDataByUserId(user_id:number){
    Logger.debug(`fetchUserProductJunctionDataByUserId() userDTO:${JSON.stringify(user_id)} `, APP);

    return this.userProductJunctionDb.find({user_id:user_id}).pipe(
      map(doc=>doc)
    )
  }

  

  fetchUserProductJunctionDataByUserIdOrOrgIdAndProductId(createUserProductJunctionDto:CreateUserProductJunctionDto){
    Logger.debug(`fetchUserProductJunctionDataByUserIdOrOrgIdAndProductId() userDTO:${JSON.stringify(createUserProductJunctionDto)} `, APP);

    if(createUserProductJunctionDto.user_id){
    return this.userProductJunctionDb.find({user_id:createUserProductJunctionDto.user_id,product_id:createUserProductJunctionDto.product_id}).pipe(
      map(doc=>{
        if(doc.length==0) throw new NotFoundException()
        return {total_tests:doc[0].total_tests}})
    )}
    else if (createUserProductJunctionDto.org_id){
      return this.userProductJunctionDb.find({org_id:createUserProductJunctionDto.org_id,product_id:createUserProductJunctionDto.product_id}).pipe(
        concatMap(async orgData=>{
           const total_tests= await orgData.reduce((pre, acc) => pre + acc['total_tests'], 0); 
            return {total_tests: total_tests}

          })
      )}
  }


  fetchByOrgIdAndProductIdAndUpdate(org_id : any , product_id : any, attempts : any , is_pilot_duration : any){
    Logger.debug(`fetchUserProductJunctionDataByUserIdOrOrgIdAndProductId() userDTO:${JSON.stringify(org_id)} `, APP);

      return this.userProductJunctionDb.find({org_id: org_id,product_id: product_id}).pipe(
        map(async orgData=>{
          for(let i =0; i < orgData.length; i++){
            lastValueFrom(this.userProductJunctionDb.findByIdandUpdate({id : orgData[i].id.toString() , quries : {attempts : attempts , is_pilot_duration : is_pilot_duration}}))

          }

          })
      )
  }

  fetchByOrgIdAndProductIdAndUpdateWithNoAttempts(org_id : any , product_id : any , is_pilot_duration : any){
    Logger.debug(`fetchUserProductJunctionDataByUserIdOrOrgIdAndProductId() userDTO:${JSON.stringify(org_id)} `, APP);

      return this.userProductJunctionDb.find({org_id: org_id,product_id: product_id}).pipe(
        map(async orgData=>{
          for(let i =0; i < orgData.length; i++){
            lastValueFrom(this.userProductJunctionDb.findByIdandUpdate({id : orgData[i].id.toString() , quries : { is_pilot_duration : is_pilot_duration}}))

          }

          })
      )
  }

  fetchUserProductJunctionDataByUserIdAndProductId(user_id : number, product_id: number){
   
    return this.userProductJunctionDb.find({user_id:user_id,product_id:product_id}).pipe(
      map(doc=>doc)
    )}

    patchUserAttempts(createUserProductJunctionDto:CreateUserProductJunctionDto){
      return this.fetchUserProductJunctionDataByUserIdAndProductId(createUserProductJunctionDto.user_id , createUserProductJunctionDto.product_id).pipe(map(doc=> {

        return this.userProductJunctionDb.findByIdandUpdate({id : doc[0].id.toString() , quries :{attempts : doc[0].attempts-1}})
      }))

    }
  



}
