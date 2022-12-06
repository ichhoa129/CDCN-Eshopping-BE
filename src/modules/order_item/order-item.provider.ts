import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderItemProvider {
  REPOSITORY = 'ORDER-ITEM_REPOSITORY',
}

export const orderItemProviders = [
  {
    provide: OrderItemProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderItem),
    inject: [DatabaseProvider.SOURCE],
  },
];
