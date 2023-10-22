import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './entities/category.entity';
import { Op } from 'sequelize';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
  ) {}

  async create(createCategoryDto: Partial<Category>) {
    return this.categoryModel.create(createCategoryDto);
  }

  async findAll({ page = 1, limit = 5, keyword }: any) {
    const offset = (page - 1) * limit; // Tính toán vị trí bắt đầu của trang
    const whereClause = keyword
      ? { name: { [Op.like]: `%${keyword}%` } } // Tìm kiếm theo tên nếu có từ khóa
      : {};

    const categories = await this.categoryModel.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
    });

    return categories;
  }

  async findOne(id: number) {
    return this.categoryModel.findByPk(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      return null;
    }
    category.name = updateCategoryDto.name;
    await category.save();
    return category;
  }

  async remove(id: number) {
    return this.categoryModel.destroy({ where: { id } });
  }
}
