import { BaseEntity } from '@core/base/base.entity';
import { ProductSize } from '@app/product_size/product_size.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ColumnNumericTransformer } from 'src/common/class/numeric';

@Entity('receipts')
export class Receipt extends BaseEntity {
  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    nullable: false,
  })
  total: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  note: string;

  @OneToMany(() => ReceiptProduct, (receiptProduct) => receiptProduct.receipt)
  receiptProducts: ReceiptProduct[];
}

@Entity('receipts_products')
@Index(['productSizeId', 'receiptId'], { unique: true })
export class ReceiptProduct extends BaseEntity {
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

  @Column({
    name: 'product_size_id',
    type: 'int',
    nullable: false,
    select: false,
  })
  productSizeId: number;

  @Column({
    name: 'receipt_id',
    type: 'int',
    nullable: false,
    select: false,
  })
  receiptId: number;

  @ManyToOne(() => ProductSize, (productSize) => productSize.receiptProducts)
  @JoinColumn({ name: 'product_size_id' })
  productSize: ProductSize;

  @ManyToOne(() => Receipt, (receipt) => receipt.receiptProducts)
  @JoinColumn({ name: 'receipt_id' })
  receipt: Receipt;
}
