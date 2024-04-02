import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dtos/products.dto';
import { Query as exptessQuery } from 'express-serve-static-core';
import { IPagination, PaginationParams } from 'src/decorators/pagination';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() product: ProductDto) {
    return this.productsService.createProduct(
      product.name,
      product.description,
      product.status,
      product.tags,
    );
  }

  @Get()
  getAllProducts(
    @PaginationParams() pagination: IPagination,
    @Query() query: exptessQuery,
  ) {
    return this.productsService.getAllProducts(pagination, query);
  }

  @Get(':id')
  getOneProduct(@Param('id') productId: string) {
    return this.productsService.getOneProduct(productId);
  }

  @Patch(':id')
  updateProduct(@Param('id') productId: string, @Body() product: ProductDto) {
    return this.productsService.updateProduct(
      productId,
      product.name,
      product.description,
      product.status,
      product.tags,
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
