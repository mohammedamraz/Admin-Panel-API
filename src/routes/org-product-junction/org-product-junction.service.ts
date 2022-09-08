import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { CreateOrgProductJunctionDto } from './dto/create-org-product-junction.dto';
import { UpdateOrgProductJunctionDto } from './dto/update-org-product-junction.dto';

@Injectable()
export class OrgProductJunctionService {
  create(createOrgProductJunctionDto: CreateOrgProductJunctionDto) {
    return 'This action adds a new orgProductJunction';
  }

  findAll() {
    return `This action returns all orgProductJunction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orgProductJunction`;
  }

  update(id: number, updateOrgProductJunctionDto: UpdateOrgProductJunctionDto) {
    return `This action updates a #${id} orgProductJunction`;
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
