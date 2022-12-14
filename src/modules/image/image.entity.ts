import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '@core/base/base.entity';
import { Product } from '@app/product/product.entity';

@Entity('images')
export class Image extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  url: string;

  @ManyToMany(() => Product, (product) => product.images)
  product: Product;
}
