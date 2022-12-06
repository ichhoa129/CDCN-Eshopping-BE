import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @Inject('ORDER-ITEM_REPOSITORY')
    private orderRepository: Repository<OrderItem>,
  ) {}
}
