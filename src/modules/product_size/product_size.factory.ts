import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { ProductSize } from './product_size.entity';

define(ProductSize, () => {
  const productSize = new ProductSize();

  productSize.quantity = Number(faker.random.numeric(2));

  return productSize;
});
