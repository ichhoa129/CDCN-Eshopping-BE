import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Product } from './product.entity';

define(Product, () => {
  const product = new Product();

  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.slug = faker.lorem.slug();
  product.unit = faker.commerce.productMaterial();
  product.price = Number(faker.commerce.price(10000, 1000000));

  return product;
});
