import { DatabaseProvider } from '@app/base/database/database.provider';
import { DataSource } from 'typeorm';
import { Payment } from './payment.entity';

export enum PaymentProvider {
  REPOSITORY = 'PAYMENT_REPOSITORY',
}

export const paymentProviders = [
  {
    provide: PaymentProvider.REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: [DatabaseProvider.SOURCE],
  },
];
