import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/base/base.entity';
import { Order } from '@app/order/order.entity';
import { ProductSize } from '@app/product_size/product_size.entity';
import { ColumnNumericTransformer } from 'src/common/class/numeric';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  // @Column({
  //   name: 'order_id',
  //   type: 'int',
  //   nullable: false,
  // })
  // orderId: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    name: 'product_size_id',
    type: 'int',
    nullable: false,
  })
  productSizeId: number;

  @ManyToOne(() => ProductSize, (productSize) => productSize.orderItems)
  @JoinColumn({ name: 'product_size_id' })
  productSize: ProductSize;

  @Column({
    name: 'quantity',
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
  })
  price: number;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
  })
  total: number;
}
