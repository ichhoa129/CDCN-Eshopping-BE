import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '@core/base/base.entity';
import { User } from '@app/user/user.entity';
import { OrderItem } from '@app/order_item/order-item.entity';
import { Payment } from '@app/payment/payment.entity';
import { ColumnNumericTransformer } from 'src/common/class/numeric';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({
    name: 'status',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  status: string;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;
}
