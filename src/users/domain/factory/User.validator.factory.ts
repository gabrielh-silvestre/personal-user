import type { IUserProps } from '../entity/user.interface';
import type { IValidator } from 'src/shared/domain/validator/validator.interface';

import { UserZodValidator } from '../validator/zod.validator';

export class UserValidatorFactory {
  public static create(): IValidator<IUserProps> {
    return new UserZodValidator();
  }
}
