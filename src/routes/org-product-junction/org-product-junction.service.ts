import {  Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateOrgProductJunctionDto, ZQueryParamsDto } from './dto/create-org-product-junction.dto';
import { OrganizationService } from '../video-to-vitals/organization.service';
const APP = 'OrgProductJunctionService';
@Injectable()
export class OrgProductJunctionService {

  constructor(@DatabaseTable('organization_product_junction')
  private readonly organizationProductJunctionDb: DatabaseService<CreateOrgProductJunctionDto>,
  // private organizationService: OrganizationService
  ){}

    fetchOrgProductJunctionDataByOrgId(org_id:number){
      Logger.debug(`fetchOrgProductJunctionDataByOrgId() body: ${JSON.stringify(org_id)}`, APP);

      return this.organizationProductJunctionDb.find({org_id:org_id}).pipe(
        map(doc=>doc)
      )
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

  fetchOrgDetailsByOrgProductJunctionId(id: number){
    Logger.debug(`fetchOrgDetailsByOrgProductJunctionId() id:${id}} `, APP);

  return this.organizationProductJunctionDb.find({id:id}).pipe(
    
    map(doc=>{
      if (doc.length==0) throw new NotFoundException("data not found");
      else return doc
    }),
  )
  }

  fetchOrgDetailsByExpiryDateForDays(params: ZQueryParamsDto){
    Logger.debug(`fetchOrgDetailsByExpiryDateForDays() params:${params}} `, APP);

  return this.organizationProductJunctionDb.findByEndDateOfOrganization(params).pipe(
    map(doc=>{
      return doc
    }),
  )
  }

  
}
