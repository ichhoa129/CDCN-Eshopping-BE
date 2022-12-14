import { OrderItem } from '@app/order_item/order-item.entity';
import { Product } from '@app/product/product.entity';
import { ReceiptProduct } from '@app/receipt/receipt.entity';
import { Size } from '@app/size/size.entity';
import { BaseEntity } from '@core/base/base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('products_sizes')
@Index(['productId', 'sizeId'], { unique: true })
export class ProductSize extends BaseEntity {
  @Column({
    name: 'quantity',
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'product_id',
    type: 'int',
    nullable: false,
    select: false,
  })
  productId: number;

  @Column({
    name: 'size_id',
    type: 'int',
    nullable: false,
    select: false,
  })
  sizeId: number;

  @ManyToOne(() => Product, (product) => product.productSizes)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => Size, (size) => size.productSize)
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @OneToMany(() => ReceiptProduct, (receiptProduct) => receiptProduct.receipt)
  receiptProducts: ReceiptProduct[];
  @OneToMany(() => OrderItem, (orderItem) => orderItem.productSize)
  orderItems: OrderItem[];
}
