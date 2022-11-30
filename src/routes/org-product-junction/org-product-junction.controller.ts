import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { OrgProductJunctionService } from './org-product-junction.service';
import { CreateOrgProductJunctionDto } from './dto/create-org-product-junction.dto';
import { UpdateOrgProductJunctionDto } from './dto/update-org-product-junction.dto';

const APP = "OrgProductJunctionController";
@Controller()
export class OrgProductJunctionController {
  constructor(private readonly orgProductJunctionService: OrgProductJunctionService) {}


  @Get(':id')
  fetchOrgDetailsByOrgProductJunctionId(@Param('id')id: number){
    Logger.debug(`fetchOrgDetailsByOrgProductJunctionId() id:${id}} `, APP);

   return this.orgProductJunctionService.fetchOrgDetailsByOrgProductJunctionId(id)
  }

  // @Get(':id')
  // findAllProductsMappedWithOrganization(@Param('id') id: string) {
  //   Logger.debug(`fetchAllProducts()`, APP);
    
  //   return this.orgProductJunctionService.findAllProductsMappedWithOrganization(+id);
  // }

}
