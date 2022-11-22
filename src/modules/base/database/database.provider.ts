import { DataSource } from 'typeorm';
import { join } from 'path';
import * as fs from 'fs';
import { DATABASE_CONFIG, NODE_ENV } from '@config/env';

export enum DatabaseProvider {
  SOURCE = 'DATA_SOURCE',
}

const synchronize = false;
const dataSource = new DataSource({
  type: <any>DATABASE_CONFIG.TYPEORM_CONNECTION || 'postgres',
  host: DATABASE_CONFIG.TYPEORM_HOST,
  port: DATABASE_CONFIG.TYPEORM_PORT,
  username: DATABASE_CONFIG.TYPEORM_USERNAME,
  password: DATABASE_CONFIG.TYPEORM_PASSWORD,
  database: DATABASE_CONFIG.TYPEORM_DATABASE,
  entities: [join(__dirname, '/../../../**/*.entity{.ts,.js}')],
  synchronize: NODE_ENV === 'development' ? synchronize : false,
  maxQueryExecutionTime: DATABASE_CONFIG.DB_MAX_QUERY_TIME,
  ssl:
    DATABASE_CONFIG.DB_USE_SSL === 'true'
      ? {
          ca: fs.readFileSync('ca-certificate.crt'),
        }
      : undefined,
});

export const databaseProviders = [
  {
    provide: DatabaseProvider.SOURCE,
    useFactory: async () => dataSource.initialize(),
  },
];

export default dataSource;
