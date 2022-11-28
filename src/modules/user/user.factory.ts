import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { USER_ROLE } from 'src/common/enums';
import { hashString } from 'src/common/utils/bcrypt';
import { User } from './user.entity';

define(User, () => {
  const user = new User();
  user.fullName = faker.name.fullName();
  user.email = faker.internet.email();
  user.password = hashString('123456789');
  user.role = faker.helpers.arrayElement([USER_ROLE.ADMIN, USER_ROLE.USER]);

  return user;
});
