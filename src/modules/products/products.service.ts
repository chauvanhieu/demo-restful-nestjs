import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: Partial<Product>) {
    return this.productModel.create(createProductDto);
  }

  async findAll({ page = 1, limit = 5, keyword }) {
    const offset = (page - 1) * limit; // Tính toán vị trí bắt đầu của trang
    const whereClause = keyword
      ? { name: { [Op.like]: `%${keyword}%` } } // Tìm kiếm theo tên nếu có từ khóa
      : {};

    const products = await this.productModel.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
    });

    return products;
  }

  async findOne(id: number) {
    const product = await this.productModel.findByPk(id);
    return product ? product : null;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      return null;
    }

    product.category_id = updateProductDto.category_id;
    product.name = updateProductDto.name;
    product.price = updateProductDto.price;

    await product.save();
    console.log('123');
    return product;
  }

  async remove(id: number) {
    return this.productModel.destroy({ where: { id } });
  }
}
