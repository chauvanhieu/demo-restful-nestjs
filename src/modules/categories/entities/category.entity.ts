import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/modules/products/entities/product.entity';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Product)
  products: Product[];
}
