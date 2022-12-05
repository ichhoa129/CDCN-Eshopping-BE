import { ProductSize } from '@app/product_size/product_size.entity';
import { BaseEntity } from '@core/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('sizes')
export class Size extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @OneToMany(() => ProductSize, (productSize) => productSize.size)
  productSize: ProductSize[];
}
