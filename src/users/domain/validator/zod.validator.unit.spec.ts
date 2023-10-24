import { UserZodValidator } from './zod.validator';

import { ErrorMessage } from '@users/utils/constants';
import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';

describe('Unit test Zod validator', () => {
  let userValidator: UserZodValidator;

  beforeEach(() => {
    userValidator = new UserZodValidator();
  });

  it('should not throw any errors on valid users', () => {
    expect(() => userValidator.validate(RANDOM_USER_MOCK())).not.toThrow();
  });

  it.each([
    ['InvalidUUID', 'invalid-id', 'id', ErrorMessage.Validator.InvalidUUID],
    [
      'UsernameTooShort',
      '',
      'username',
      ErrorMessage.Validator.UsernameTooShort,
    ],
    [
      'UsernameTooLong',
      'u'.repeat(20),
      'username',
      ErrorMessage.Validator.UsernameTooLong,
    ],
    [
      'UsernameRequired',
      undefined,
      'username',
      ErrorMessage.Validator.UsernameRequired,
    ],
    [
      'InvalidEmail',
      'invalid-email',
      'email',
      ErrorMessage.Validator.InvalidEmail,
    ],
    [
      'InvalidCreatedAt',
      'invalid-date',
      'createdAt',
      ErrorMessage.Validator.InvalidCreatedAt,
    ],
    [
      'InvalidUpdatedAt',
      'invalid-date',
      'updatedAt',
      ErrorMessage.Validator.InvalidUpdatedAt,
    ],
  ])('should throw an error on "%s"', (errorKey, value, prop) => {
    const invalidUser = {
      ...RANDOM_USER_MOCK().toDto(),
      [prop]: value,
    };

    expect(() => userValidator.validate(invalidUser)).toThrow(
      ErrorMessage.Validator[errorKey],
    );
  });
});
