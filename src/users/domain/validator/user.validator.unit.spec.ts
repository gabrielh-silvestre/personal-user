import { UserClassValidator } from './user.class.validator';

import type { IUser } from '../entity/user.interface';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [VALID_USER] = USERS_MOCK;

const ERROR_MESSAGES = {
  id: 'Id must be a valid UUID v4',
  /* ---------- */
  usernameMinLength: 'Username must be at least 3 characters long',
  usernameMaxLength: 'Username must be at most 8 characters long',
  usernameRequired: 'Username is required',
  /* ---------- */
  email: 'Email must be a valid email address',
  /* ---------- */
  createdAt: 'CreatedAt must be a valid date',
  updatedAt: 'UpdatedAt must be a valid date',
};

describe('Unit test IUser validator', () => {
  it('should not throw any errors on valid users', () => {
    const userValidator = UserClassValidator.init();

    expect(() => userValidator.validate(VALID_USER.toDto())).not.toThrow();
  });

  it(`should throw "${ERROR_MESSAGES.id}" error on invalid id`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      id: 'invalid-id',
    } as IUser;

    // console.log(invalidUser);

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.id,
    );
  });

  it(`should throw "${ERROR_MESSAGES.usernameMinLength}" error on invalid username`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      username: 'u',
    } as IUser;

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.usernameMinLength,
    );
  });

  it(`should throw "${ERROR_MESSAGES.usernameMaxLength}" error on invalid username`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      username: 'u'.repeat(20),
    } as IUser;

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.usernameMaxLength,
    );
  });

  it(`should throw "${ERROR_MESSAGES.usernameRequired}" error on invalid username`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      username: '',
    } as IUser;

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.usernameRequired,
    );
  });

  it(`should throw "${ERROR_MESSAGES.email}" error on invalid email`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      email: 'invalid-email',
    } as IUser;

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.email,
    );
  });

  it(`should throw "${ERROR_MESSAGES.createdAt}" error on invalid createdAt`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      createdAt: new Date('invalid-date'),
    } as IUser;

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.createdAt,
    );
  });

  it(`should throw "${ERROR_MESSAGES.updatedAt}" error on invalid updatedAt`, () => {
    const userValidator = UserClassValidator.init();
    const invalidUser: IUser = {
      ...VALID_USER.toDto(),
      updatedAt: new Date('invalid-date'),
    } as IUser;

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ERROR_MESSAGES.updatedAt,
    );
  });
});
