import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '@core/base/base.entity';
import { Category } from '@app/category/category.entity';
import { PRODUCT_STATUS } from 'src/common/enums/product.enum';
import { ProductSize } from '@app/product_size/product_size.entity';
import { Image } from '@app/image/image.entity';
import { Discount } from '@app/discount/discount.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'price',
    type: 'float',
    nullable: false,
  })
  price: number;

  @Column({
    name: 'unit',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  unit: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    nullable: false,
    default: PRODUCT_STATUS.ACTIVE,
  })
  status: string;

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  stock: number;

  @Column({
    name: 'category_id',
    type: 'int',
    nullable: false,
    select: false,
  })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductSize, (productSize) => productSize.product, {
    cascade: true,
  })
  productSizes: ProductSize[];

  @ManyToMany(() => Image, {
    cascade: true,
  })
  @JoinTable({
    name: 'products_images',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'image_id',
      referencedColumnName: 'id',
    },
  })
  images: Image[];

  @ManyToMany(() => Discount, (discount) => discount.products)
  discount: Discount;
}
