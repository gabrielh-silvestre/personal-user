import { v4 as uuid } from 'uuid';

import { User } from './User';
import { PasswordFactory } from '../factory/Password.factory';

import { FAKE_EVENT_DISPATCHER } from '@shared/utils/mocks/users.mock';

const VALID_USERNAME = 'username';
const VALID_EMAIL = 'email@email.com';
const VALID_PASSWORD = 'password';

describe('Unit test domain User entity', () => {
  it('should create a new user', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    expect(user).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toEqual(user.createdAt);
  });

  it('should change username', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    user.changeUsername('newUser', FAKE_EVENT_DISPATCHER);

    expect(user.username).toBe('newUser');
    expect(FAKE_EVENT_DISPATCHER.notify).toBeCalledTimes(1);
  });

  it('should change email', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    user.changeEmail('newEmail@email.com');
    expect(user.email).toBe('newEmail@email.com');
  });

  it('should change password', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    user.changePassword(
      PasswordFactory.createNew('newPassword'),
      FAKE_EVENT_DISPATCHER,
    );

    expect(user.password.isEqual('newPassword')).toBeTruthy();
    expect(FAKE_EVENT_DISPATCHER.notify).toBeCalledTimes(1);
  });

  it('should throw error when id is invalid', () => {
    expect(
      () =>
        new User(
          'invalidId',
          VALID_USERNAME,
          'email',
          PasswordFactory.createNew(VALID_PASSWORD),
          new Date(),
          new Date(),
        ),
    ).toThrowError('Id must be a valid UUID v4');
  });

  it('should throw error when username is invalid', () => {
    expect(
      () =>
        new User(
          uuid(),
          'u',
          VALID_EMAIL,
          PasswordFactory.createNew(VALID_PASSWORD),
          new Date(),
          new Date(),
        ),
    ).toThrowError('Username must be at least 3 characters long');

    expect(
      () =>
        new User(
          uuid(),
          VALID_USERNAME.repeat(20),
          'email',
          PasswordFactory.createNew(VALID_PASSWORD),
          new Date(),
          new Date(),
        ),
    ).toThrowError('Username must be at most 8 characters long');
  });

  it('should throw error when email is invalid', () => {
    expect(
      () =>
        new User(
          uuid(),
          VALID_USERNAME,
          'email',
          PasswordFactory.createNew(VALID_PASSWORD),
          new Date(),
          new Date(),
        ),
    ).toThrowError('Email must be a valid email address');
  });

  it('should throw error when change to a invalid username', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    const actShortUsername = () =>
      user.changeUsername('u', FAKE_EVENT_DISPATCHER);
    const actLongUsername = () =>
      user.changeUsername(VALID_USERNAME.repeat(20), FAKE_EVENT_DISPATCHER);

    expect(actShortUsername).toThrowError(
      'Username must be at least 3 characters long',
    );
    expect(actLongUsername).toThrowError(
      'Username must be at most 8 characters long',
    );
    expect(FAKE_EVENT_DISPATCHER.notify).not.toBeCalled();
  });

  it('should throw error when change to a invalid email', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    expect(() => user.changeEmail('email')).toThrowError(
      'Email must be a valid email address',
    );
  });

  it('should throw error when change to a invalid password', () => {
    const user = new User(
      uuid(),
      VALID_USERNAME,
      VALID_EMAIL,
      PasswordFactory.createNew(VALID_PASSWORD),
      new Date(),
      new Date(),
    );

    expect(() =>
      user.changePassword(PasswordFactory.createNew(''), FAKE_EVENT_DISPATCHER),
    ).toThrowError('Password is required');

    expect(() =>
      user.changePassword(
        PasswordFactory.createNew('p'),
        FAKE_EVENT_DISPATCHER,
      ),
    ).toThrowError('Password must be at least 8 characters long');

    expect(() =>
      user.changePassword(
        PasswordFactory.createNew('password'.repeat(20)),
        FAKE_EVENT_DISPATCHER,
      ),
    ).toThrowError('Password must be at most 16 characters long');
  });

  it('should throw error when insert a invalid create date', () => {
    expect(
      () =>
        new User(
          uuid(),
          VALID_USERNAME,
          VALID_EMAIL,
          PasswordFactory.createNew(VALID_PASSWORD),
          new Date('invalid'),
          new Date(),
        ),
    ).toThrowError('CreatedAt must be a valid date');
  });

  it('should throw error when insert a invalid update date', () => {
    expect(
      () =>
        new User(
          uuid(),
          VALID_USERNAME,
          VALID_EMAIL,
          PasswordFactory.createNew(VALID_PASSWORD),
          new Date(),
          new Date('invalid'),
        ),
    ).toThrowError('UpdatedAt must be a valid date');
  });
});
