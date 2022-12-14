import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Discount } from './discount.entity';

export enum DiscountProvider {
  REPOSITORY = 'DISCOUNT_REPOSITORY',
}

export const discountProviders = [
  {
    provide: DiscountProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Discount),
    inject: [DatabaseProvider.SOURCE],
  },
];
