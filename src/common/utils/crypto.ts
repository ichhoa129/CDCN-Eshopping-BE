import { createHmac } from 'crypto';

export function hash(text: string, secretKey: string): string {
  return createHmac('sha256', secretKey).update(text).digest('hex');
}
