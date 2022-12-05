import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';

export enum CategoryProvider {
  REPOSITORY = 'CATEGORY_REPOSITORY',
}

export const categoryProviders = [
  {
    provide: CategoryProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [DatabaseProvider.SOURCE],
  },
];
