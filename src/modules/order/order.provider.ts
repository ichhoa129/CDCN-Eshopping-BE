import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Order } from './order.entity';

export enum OrderProvider {
  REPOSITORY = 'ORDER_REPOSITORY',
}

export const orderProviders = [
  {
    provide: OrderProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: [DatabaseProvider.SOURCE],
  },
];
