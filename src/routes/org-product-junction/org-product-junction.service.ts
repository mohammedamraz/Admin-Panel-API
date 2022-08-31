import { Injectable } from '@nestjs/common';
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
}
