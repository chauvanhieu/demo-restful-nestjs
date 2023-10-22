import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productsService.create(createProductDto);
      return res.status(HttpStatus.CREATED).json(product);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Query('keyword') keyword: string,
    @Res() res: Response,
  ) {
    try {
      const products = await this.productsService.findAll({
        page,
        limit,
        keyword,
      });
      return res.status(HttpStatus.OK).json({
        page,
        limit,
        products,
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.productsService.findOne(+id);
      if (!product) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'Product not found' });
      }
      return res.status(HttpStatus.OK).json(product);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const product = await this.productsService.update(+id, updateProductDto);
      if (!product) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'Product not found' });
      }
      return res.status(HttpStatus.OK).json(product);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const deleted = await this.productsService.remove(+id);
      if (!deleted) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'Product not found' });
      }
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }
}
