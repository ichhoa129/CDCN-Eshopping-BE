import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { paymentProviders } from './payment.provider';
import { OrderModule } from '@app/order/order.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => OrderModule)],
  providers: [PaymentService, ...paymentProviders],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
