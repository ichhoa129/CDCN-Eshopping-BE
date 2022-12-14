import { Product } from '@app/product/product.entity';
import { BaseEntity } from '@core/base/base.entity';
import { AfterLoad, Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('discounts')
export class Discount extends BaseEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  percent: number;

  @Column({
    name: 'start_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  startDate: string;

  @Column({
    name: 'end_date',
    type: 'timestamp',
    nullable: false,
  })
  endDate: string;

  @ManyToMany(() => Product, (product) => product.discount, {
    cascade: true,
  })
  @JoinTable({
    name: 'products_discounts',
    joinColumn: {
      name: 'discount_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @AfterLoad()
  convertPercent() {
    this.percent *= 100;
  }
}
