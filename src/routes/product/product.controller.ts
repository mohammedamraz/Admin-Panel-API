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

  @Get()
  fetchAllProducts() {
    Logger.debug(`fetchAllProducts()`, APP);

    return this.productService.fetchAllProducts();
  }

  @Get(':id')
  fetchProductById(@Param('id') id: number) {
    Logger.debug(`fetchAllProducts() id:${id}`, APP);

    return this.productService.fetchProductById(id);
  }

}
