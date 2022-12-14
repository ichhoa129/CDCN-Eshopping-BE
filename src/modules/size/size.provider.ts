import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Size } from './size.entity';

export enum SizeProvider {
  REPOSITORY = 'SIZE_REPOSITORY',
}

export const sizeProviders = [
  {
    provide: SizeProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Size),
    inject: [DatabaseProvider.SOURCE],
  },
];
