import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { UserProductJunctionService } from './user-product-junction.service';
import { CreateUserProductJunctionDto } from './dto/create-user-product-junction.dto';
import { UpdateUserProductJunctionDto } from './dto/update-user-product-junction.dto';
const APP = "UserProductJunctionController"

@Controller()
export class UserProductJunctionController {
  constructor(private readonly userProductJunctionService: UserProductJunctionService) {}

  @Post()
  createUserProductJunction(@Body() createUserProductJunctionDto: CreateUserProductJunctionDto) {
      Logger.debug(`createUserProductJunction createUserProductJunctionDto: ${JSON.stringify(createUserProductJunctionDto)}`, APP);

      return this.userProductJunctionService.createUserProductJunction(createUserProductJunctionDto);
  }

  // @Get(':org_id')
  // fetchTotalTestOfOrganizationByOrgId(@Param('org_id') org_id: number){
  //   Logger.debug(`fetchTestDataByOrgId() id:${org_id}} `, APP);

  //  return this.userProductJunctionService.fetchTotalTestOfOrganizationByOrgId(org_id)
  // }
}
