import { SYSID } from '@core/constants/system';
import { config } from 'dotenv';

config();
const env = process.env;

export const SERVER_PORT = env.SERVER_PORT || 3000;
export const SYSTEM_ID = env.SYSTEM_ID || SYSID.LOCALHOST;
export const NODE_ENV = env.NODE_ENV || 'development';
export const SYSTEM_LOG_INFO = getLogLevel();
export const REDIS_HOST = env.REDIS_HOST || 'localhost';
export const EMAIL_CONFIRMATION_URL = env.EMAIL_CONFIRMATION_URL;

export const BCRYPT_SALT_ROUND =
  parseInt(env.BCRYPT_SALT_ROUND as string) || 10;
export const DATABASE_CONFIG = {
  TYPEORM_CONNECTION: env.TYPEORM_CONNECTION || 'postgres',
  TYPEORM_HOST: env.TYPEORM_HOST || 'localhost',
  TYPEORM_PORT: parseInt(env.TYPEORM_PORT) || 3306,
  TYPEORM_USERNAME: env.TYPEORM_USERNAME || 'postgres',
  TYPEORM_PASSWORD: env.TYPEORM_PASSWORD || 'postgres',
  TYPEORM_DATABASE: env.TYPEORM_DATABASE || 'eshopping',
  TYPEORM_MIGRATION_DIR: env.TYPEORM_MIGRATION_DIR || 'src/database/migrations',
  TYPEORM_MIGRATIONS: env.TYPEORM_MIGRATIONS || 'dist/database/migrations/*.js',
  TYPEORM_ENTITIES_DIR: env.TYPEORM_ENTITIES_DIR || 'dist/**/*.entity.js',
  DB_MAX_QUERY_TIME: parseInt(env.DB_MAX_QUERY_TIME) || 10,
  DB_USE_SSL: env.DB_USE_SSL || false,
};

export const JWT = {
  SECRET: env.JWT_SECRET || 'WibuNeverDie',
  EXPIRES_IN: env.JWT_EXPIRES_IN || '1d',
};

export const SENTRY_DSN = env.SENTRY_DSN;
export const SENTRY_TRACE_SAMPLE_RATE = parseFloat(
  env.SENTRY_TRACE_SAMPLE_RATE || '0.1',
);

function getLogLevel() {
  try {
    return JSON.parse(env.SYSTEM_LOG_INFO);
  } catch (error) {
    return 'all';
  }
}
