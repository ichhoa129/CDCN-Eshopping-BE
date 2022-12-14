import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { orderItemProviders } from './order-item.provider';

@Module({
  imports: [DatabaseModule],
  providers: [OrderItemService, ...orderItemProviders],
  controllers: [OrderItemController],
  exports: [OrderItemService],
})
export class OrderItemModule {}
