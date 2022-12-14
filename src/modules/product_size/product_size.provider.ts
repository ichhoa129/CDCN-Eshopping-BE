import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { ProductSize } from './product_size.entity';

export enum ProductSizeProvider {
  REPOSITORY = 'PRODUCT_SIZE_REPOSITORY',
}

export const productSizeProviders = [
  {
    provide: ProductSizeProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductSize),
    inject: [DatabaseProvider.SOURCE],
  },
];
