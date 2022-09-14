import {  Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateOrgProductJunctionDto } from './dto/create-org-product-junction.dto';
import { UpdateOrgProductJunctionDto } from './dto/update-org-product-junction.dto';

@Injectable()
export class OrgProductJunctionService {

  constructor(@DatabaseTable('organization_product_junction')
  private readonly organizationProductJunctionDb: DatabaseService<CreateOrgProductJunctionDto>){}

    fetchOrgProductJunctionDataByOrgId(org_id:number){
      return this.organizationProductJunctionDb.find({org_id:org_id}).pipe(
        map(doc=>doc)
      )
    }


  remove(id: number) {
    return `This action removes a #${id} orgProductJunction`;
  }

  // findAllProductsMappedWithOrganization(id:any) {
  //   Logger.debug(`findAllProductsMappedWithOrganization() `, APP);

  //   return this.productDb.find({ is_active: true }).pipe(
  //     catchError(err => { throw new UnprocessableEntityException(err.message) }),
  //     map(doc => {
  //       if (doc.length == 0) {
  //         throw new NotFoundException('No Products Found')
  //       }
  //       else {
  //         return doc
  //       }
  //     }),
  //   );
  // }
}
