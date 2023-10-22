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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoriesService.create(createCategoryDto);
      return res.status(HttpStatus.CREATED).json(category);
    } catch (error) {
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
      const categories = await this.categoriesService.findAll({
        page,
        limit,
        keyword,
      });
      return res.status(HttpStatus.OK).json({
        page,
        limit,
        categories,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const category = await this.categoriesService.findOne(+id);
      if (category) {
        return res.status(HttpStatus.CREATED).json(category);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Category not found' });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    try {
      const category = await this.categoriesService.update(
        +id,
        updateCategoryDto,
      );
      if (category) {
        return res.status(HttpStatus.OK).json(category);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Category not found' });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.categoriesService.remove(+id);
      return res.status(HttpStatus.NO_CONTENT).json({ message: 'Deleted' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred',
      });
    }
  }
}
