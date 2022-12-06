import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { orderProviders } from './order.provider';
import { productSizeProviders } from '@app/product_size/product_size.provider';
import { userProviders } from '@app/user/user.provider';
import { PaymentModule } from '@app/payment/payment.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => PaymentModule)],
  providers: [
    OrderService,
    ...orderProviders,
    ...productSizeProviders,
    ...userProviders,
  ],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
