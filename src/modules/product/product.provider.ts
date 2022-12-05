import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Product } from './product.entity';

export enum ProductProvider {
  REPOSITORY = 'PRODUCT_REPOSITORY',
}

export const productProviders = [
  {
    provide: ProductProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [DatabaseProvider.SOURCE],
  },
];
