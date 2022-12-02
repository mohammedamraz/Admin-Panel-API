import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query } from '@nestjs/common';
import { UserProductJunctionService } from './user-product-junction.service';
import { CreateUserProductJunctionDto } from './dto/create-user-product-junction.dto';
import { UpdateUserProductJunctionDto } from './dto/update-user-product-junction.dto';
const APP = "UserProductJunctionController"

@Controller()
export class UserProductJunctionController {
  constructor(private readonly userProductJunctionService: UserProductJunctionService) {}


  @Get('tests')
  fetchUserProductJunctionDataByUserIdOrOrgIdAndProductId(@Query() createUserProductJunctionDto: CreateUserProductJunctionDto){
    Logger.debug(`fetchUserProductJunctionDataByUserIdAndProductId() id:${createUserProductJunctionDto}} `, APP);

   return this.userProductJunctionService.fetchUserProductJunctionDataByUserIdOrOrgIdAndProductId(createUserProductJunctionDto)
  }

  
}
