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
    
   return this.userProductJunctionDb.save(createUserProductJunctionDto).pipe(
    map(doc=>doc)
   )
  }

  fetchUserProductJunctionDataByOrgId(org_id:number){
    return this.userProductJunctionDb.find({org_id:org_id}).pipe(
      map(doc=>doc)
    )
  }


}
