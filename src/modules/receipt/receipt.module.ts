import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { receiptProviders } from './receipt.provider';
import { DatabaseModule } from '@app/base/database/database.module';
import { ProductSizeModule } from '@app/product_size/product_size.module';
import { productSizeProviders } from '@app/product_size/product_size.provider';

@Module({
  imports: [DatabaseModule, ProductSizeModule],
  providers: [ReceiptService, ...receiptProviders, ...productSizeProviders],
  controllers: [ReceiptController],
  exports: [ReceiptService],
})
export class ReceiptModule {}
