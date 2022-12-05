import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Receipt } from './receipt.entity';

export enum ReceiptProvider {
  REPOSITORY = 'RECEIPT_REPOSITORY',
}

export const receiptProviders = [
  {
    provide: ReceiptProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Receipt),
    inject: [DatabaseProvider.SOURCE],
  },
];
