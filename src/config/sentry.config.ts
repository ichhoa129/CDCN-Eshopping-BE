import * as Sentry from '@sentry/node';
import '@sentry/tracing';
import { SENTRY_DSN, SENTRY_TRACE_SAMPLE_RATE } from './env';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
});

const transaction = Sentry.startTransaction({
  op: 'eshopping',
  name: 'Eshopping Transaction',
});

export { Sentry, transaction };
