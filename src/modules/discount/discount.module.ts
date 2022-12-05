import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { discountProviders } from './discount.provider';
import { CategoryModule } from '@app/category/category.module';
import { ProductModule } from '@app/product/product.module';

@Module({
  imports: [DatabaseModule, CategoryModule, ProductModule],
  providers: [DiscountService, ...discountProviders],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
