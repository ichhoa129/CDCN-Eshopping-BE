import { DatabaseModule } from '@app/base/database/database.module';
import { Module } from '@nestjs/common';
import { productSizeProviders } from './product_size.provider';
import { ProductSizeService } from './product_size.service';

@Module({
  imports: [DatabaseModule],
  providers: [ProductSizeService, ...productSizeProviders],
  exports: [ProductSizeService],
})
export class ProductSizeModule {}
