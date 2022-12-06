import { Order } from '@app/order/order.entity';
import { BaseEntity } from '@core/base/base.entity';
import { ColumnNumericTransformer } from 'src/common/class/numeric';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({
    name: 'order_id',
    type: 'int',
    nullable: false,
  })
  orderId: number;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'trans_id',
    type: 'varchar',
    nullable: false,
  })
  transId: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  message: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  payType: string;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;
}
