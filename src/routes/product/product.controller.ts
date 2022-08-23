import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

const APP = "ProductController";
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  addProduct(@Body() createProductDto: CreateProductDto) {
    Logger.debug(`addProduct() createProductDto:${JSON.stringify(createProductDto)} }`, APP);

    return this.productService.addProduct(createProductDto);
  }

}
