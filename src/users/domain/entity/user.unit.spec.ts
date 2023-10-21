import { v4 as uuid } from 'uuid';

import type { IUserProps } from './user.interface';

import { User } from './User';
import { PasswordFactory } from '../factory/Password.factory';

const VALID_USERNAME = 'username';
const VALID_EMAIL = 'email@email.com';

const CREATE_USER_PROPS: IUserProps = {
  id: uuid(),
  username: VALID_USERNAME,
  email: VALID_EMAIL,
  password: PasswordFactory.createNew('password'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Unit test domain User entity', () => {
  it('should create a new user', () => {
    const user = new User({ ...CREATE_USER_PROPS });

    expect(user).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toEqual(user.createdAt);
  });

  it('should change username', () => {
    const user = new User({ ...CREATE_USER_PROPS });

    user.changeUsername('newUser');
    expect(user.username).toBe('newUser');
  });

  it('should change email', () => {
    const user = new User({ ...CREATE_USER_PROPS });

    user.changeEmail('newEmail@email.com');
    expect(user.email).toBe('newEmail@email.com');
  });

  it('should change password', () => {
    const user = new User({ ...CREATE_USER_PROPS });

    user.changePassword(PasswordFactory.createNew('newPassword'));
    expect(user.password.isEqual('newPassword')).toBeTruthy();
  });

  it('should throw error when id is invalid', () => {
    const INVALID_PROPS = {
      ...CREATE_USER_PROPS,
      id: 'invalidId',
    };

    expect(() => new User(INVALID_PROPS)).toThrowError(
      'Id must be a valid UUID v4',
    );
  });

  it.each([
    ['too short', 'u', 'Username must be at least 3 characters long'],
    [
      'too long',
      VALID_USERNAME.repeat(20),
      'Username must be at most 8 characters long',
    ],
  ])('should throw error when username is %s', (_, username, error) => {
    const INVALID_PROPS = {
      ...CREATE_USER_PROPS,
      username,
    };

    expect(() => new User(INVALID_PROPS)).toThrowError(error);
  });

  it('should throw error when email is invalid', () => {
    const INVALID_PROPS = {
      ...CREATE_USER_PROPS,
      email: 'email',
    };

    expect(() => new User(INVALID_PROPS)).toThrowError(
      'Email must be a valid email address',
    );
  });

  it.each([
    ['short', 'u', 'Username must be at least 3 characters long'],
    ['long', 'u'.repeat(20), 'Username must be at most 8 characters long'],
  ])(
    'should throw error when change to a %s username',
    (_, newUsername, error) => {
      const user = new User({ ...CREATE_USER_PROPS });

      expect(() => user.changeUsername(newUsername)).toThrowError(error);
    },
  );

  it('should throw error when change to a invalid email', () => {
    const user = new User({ ...CREATE_USER_PROPS });

    expect(() => user.changeEmail('email')).toThrowError(
      'Email must be a valid email address',
    );
  });

  it.each([
    ['empty', '', 'Password is required'],
    ['short', 'p', 'Password must be at least 8 characters long'],
    [
      'long',
      'password'.repeat(20),
      'Password must be at most 16 characters long',
    ],
  ])(
    'should throw error when change to a %s password',
    (_, newPassword, error) => {
      const user = new User({ ...CREATE_USER_PROPS });

      expect(() =>
        user.changePassword(PasswordFactory.createNew(newPassword)),
      ).toThrowError(error);
    },
  );
});
