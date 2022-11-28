import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

export enum UserProvider {
  REPOSITORY = 'USER_REPOSITORY',
}

export const userProviders = [
  {
    provide: UserProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DatabaseProvider.SOURCE],
  },
];
