import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Image } from './image.entity';

define(Image, () => {
  const image = new Image();
  image.name = faker.name.jobTitle();
  image.url = faker.image.fashion();

  return image;
});
