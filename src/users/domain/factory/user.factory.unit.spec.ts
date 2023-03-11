import { UserFactory } from './User.factory';

import { FAKE_EVENT_DISPATCHER } from '@shared/utils/mocks/users.mock';

const VALID_ID = 'c0a80121-7acc-4fd3-8cda-4d18c0375a59';
const VALID_USERNAME = 'username';
const VALID_EMAIL = 'email@email.com';
const VALID_PASSWORD = 'password';

describe('Test Domain User factory', () => {
  it('should create a new user', () => {
    const user = UserFactory.create(
      FAKE_EVENT_DISPATCHER,
      VALID_USERNAME,
      VALID_EMAIL,
      VALID_PASSWORD,
    );

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe('username');
    expect(user.email).toBe('email@email.com');

    expect(user.password).toBeDefined();
    expect(user.password.toString()).not.toBe('password');

    expect(FAKE_EVENT_DISPATCHER.notify).toBeCalledTimes(1);
  });

  it('should create a user from persistence', () => {
    const user = UserFactory.createFromPersistence(
      VALID_ID,
      VALID_USERNAME,
      VALID_EMAIL,
      new Date(),
      new Date(),
      VALID_PASSWORD,
    );

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.username).toBe('username');
    expect(user.email).toBe('email@email.com');

    expect(user.password).toBeDefined();
    expect(user.password.toString()).toBe('password');
  });
});
