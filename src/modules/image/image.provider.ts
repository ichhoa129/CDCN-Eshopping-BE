import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Image } from './image.entity';

export enum ImageProvider {
  REPOSITORY = 'IMAGE_REPOSITORY',
}

export const imageProviders = [
  {
    provide: ImageProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Image),
    inject: [DatabaseProvider.SOURCE],
  },
];
