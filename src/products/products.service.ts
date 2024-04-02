import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';
import { Query } from 'express-serve-static-core';
import { IPagination } from 'src/decorators/pagination';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  /**
   * Create product
   *
   * @param name
   * @param description
   * @param status
   * @param tags
   */
  async createProduct(
    name: string,
    description: string,
    status: string,
    tags: string[],
  ) {
    const newProduct = new this.productModel({
      name,
      description,
      status,
      tags,
    });
    return newProduct.save();
    // return result.id as string;
  }

  /**
   * Get All Products
   */
  async getAllProducts(pagination: IPagination, query: Query) {
    const filter: any = {};
    const { size, offset } = pagination;

    if (query.keyword) {
      filter.$or = [
        { name: { $regex: query.keyword, $options: 'i' } },
        { tags: { $regex: query.keyword, $options: 'i' } },
      ];
    }

    const total = await this.productModel.countDocuments(filter && filter);
    const products = await this.productModel
      .find(filter && filter)
      .limit(size)
      .skip(offset)
      .exec();

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        status: product.status,
        tags: product.tags,
      })),
      total: total,
    };
  }

  /**
   * Get One Product
   * @param productId
   */
  async getOneProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product.id,
      name: product.name,
      discription: product.description,
      status: product.status,
      tags: product.tags,
    };
  }

  async updateProduct(
    productId: string,
    name: string,
    description: string,
    status: 'Draft' | 'Listed' | 'Archive',
    tags: string[],
  ) {
    const modifyProduct = await this.findProduct(productId);

    //Only modify Values passed
    if (name) modifyProduct.name = name;
    if (description) modifyProduct.description = description;
    if (status) modifyProduct.status = status;
    if (tags) modifyProduct.tags = tags;

    return modifyProduct.save();
  }

  async deleteProduct(productId: string) {
    const result = await this.productModel.deleteOne({ _id: productId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find product.');
    }
    return { success: true };
  }

  private async findProduct(id: string): Promise<Product> {
    let product: any;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
