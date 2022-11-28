import { config } from 'dotenv';

config();
const env = process.env;

export const MOMO_CONFIG = {
  partnerCode: env.MOMO_PARTNER_CODE || '',
  partnerName: env.MOMO_PARTNER_NAME || 'Eshopping',
  accessKey: env.MOMO_ACCESS_KEY || '',
  secretKey: env.MOMO_SECRET_KEY || '',
  requestType: env.MOMO_REQUEST_TYPE || 'captureWallet',
  redirectUrl:
    env.MOMO_REDIRECT_URL || 'https://eshopping.ichhoa.dev/payment/confirm',
  ipnUrl:
    env.MOMO_IPN_URL || 'https://eshopping.ichhoa.dev/api/v1/payments/notify',
  paymentUrl:
    env.MOMO_PAYMENT_URL ||
    'https://test-payment.momo.vn/v2/gateway/api/create',
};
