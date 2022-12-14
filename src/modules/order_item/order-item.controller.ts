import { Controller } from '@nestjs/common';
import { OrderItemService } from './order-item.service';

@Controller('order-items')
export class OrderItemController {
  constructor(public orderItemService: OrderItemService) {}
}
