import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Size } from './size.entity';

define(Size, () => {
  const size = new Size();

  size.name = faker.commerce.price(30, 50, 0);

  return size;
});
