import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { CreateGenericTableDto } from './dto/create-generic-table.dto';
import { GenericUrlService } from './generic-url.service';
// import { ProductService } from './product.service';
// import { CreateProductDto } from './dto/create-product.dto';

const APP = "GenericUrlController";
@Controller()
export class GenericUrlController {
  constructor(private readonly genericUrlService: GenericUrlService) { }

  @Post()
  addGenericUrl(@Body() createGenericTableDto: CreateGenericTableDto) {
    Logger.debug(`addGenericUrl() createProductDto:${JSON.stringify(createGenericTableDto)} }`, APP);

    return this.genericUrlService.addGenericUrl(createGenericTableDto);
  }

  @Get()
  fetchGenericTable() {
    Logger.debug(`fetchGenericTable()`, APP);

    return this.genericUrlService.fetchGenericTable();
  }


}
