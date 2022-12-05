import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Category } from './category.entity';

define(Category, () => {
  const category = new Category();

  category.name = faker.commerce.department();

  return category;
});
