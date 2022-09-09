import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { OrgProductJunctionService } from './org-product-junction.service';
import { CreateOrgProductJunctionDto } from './dto/create-org-product-junction.dto';
import { UpdateOrgProductJunctionDto } from './dto/update-org-product-junction.dto';

const APP = "OrgProductJunctionController";
@Controller()
export class OrgProductJunctionController {
  constructor(private readonly orgProductJunctionService: OrgProductJunctionService) {}


  // @Get()
  // findAll() {
  //   return this.orgProductJunctionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orgProductJunctionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrgProductJunctionDto: UpdateOrgProductJunctionDto) {
  //   return this.orgProductJunctionService.update(+id, updateOrgProductJunctionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orgProductJunctionService.remove(+id);
  // }

  // @Get(':id')
  // findAllProductsMappedWithOrganization(@Param('id') id: string) {
  //   Logger.debug(`fetchAllProducts()`, APP);
    
  //   return this.orgProductJunctionService.findAllProductsMappedWithOrganization(+id);
  // }

}
