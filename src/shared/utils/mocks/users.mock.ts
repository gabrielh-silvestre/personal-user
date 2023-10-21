import { faker } from '@faker-js/faker';

import { User } from '@users/domain/entity/User';
import { UserFactory } from '@users/domain/factory/User.factory';

export const USERS_MOCK: User[] = [
  UserFactory.create('John', 'john@email.com', 'password'),
  UserFactory.create('Doe', 'doe@email.com', 'password'),
  UserFactory.create('Jane', 'jane@email.com', 'password'),
];

export const RANDOM_USER_MOCK = (): User =>
  UserFactory.create(
    faker.string.alpha({ length: 6 }),
    faker.internet.email(),
    faker.internet.password({ length: 10 }),
  );

export const generateRandomUsers = (quantity: number): User[] => {
  const users: User[] = [];

  for (let i = 0; i < quantity; i++) {
    users.push(RANDOM_USER_MOCK());
  }

  return users;
};
