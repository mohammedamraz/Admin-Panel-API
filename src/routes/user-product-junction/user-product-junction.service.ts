import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateUserProductJunctionDto } from './dto/create-user-product-junction.dto';
import { UpdateUserProductJunctionDto } from './dto/update-user-product-junction.dto';

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
    return this.userProductJunctionDb.find({user_id:user_id}).pipe(
      map(doc=>doc)
    )
  }

  fetchUserProductJunctionDataByUserIdAndProductId(user_id:number,product_id:number){
    return this.userProductJunctionDb.find({user_id:user_id,product_id:product_id}).pipe(
      map(doc=>doc)
    )
  }

  // fetchTotalTestOfOrganizationByOrgId(org_id: number){

     
   

  // }


}
