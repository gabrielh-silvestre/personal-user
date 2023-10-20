import type { IValidator } from 'src/shared/domain/validator/validator.interface';

import { User } from '../entity/User';
import { UserClassValidator } from '../validator/user.class.validator';

export class UserValidatorFactory {
  public static create(): IValidator<User> {
    return UserClassValidator.init();
  }
}
