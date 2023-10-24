import { z, ZodError } from 'zod';

import type { IUserProps } from '../entity/user.interface';
import type { IValidator } from '@shared/domain/validator/validator.interface';

import { UserException } from '../exception/User.exception';

import { ErrorMessage } from '@users/utils/constants';

export class UserZodValidator implements IValidator<IUserProps> {
  private readonly schema = z.object({
    id: z.string().uuid(ErrorMessage.Validator.InvalidUUID),
    username: z
      .string({
        required_error: ErrorMessage.Validator.UsernameRequired,
        invalid_type_error: ErrorMessage.Validator.UsernameRequired,
      })
      .min(3, ErrorMessage.Validator.UsernameTooShort)
      .max(8, ErrorMessage.Validator.UsernameTooLong),
    email: z.string().email(ErrorMessage.Validator.InvalidEmail),
    avatar: z
      .string({
        required_error: ErrorMessage.Validator.InvalidAvatar,
        invalid_type_error: ErrorMessage.Validator.InvalidAvatar,
      })
      .nullable(),
    createdAt: z.date({
      required_error: ErrorMessage.Validator.InvalidCreatedAt,
      invalid_type_error: ErrorMessage.Validator.InvalidCreatedAt,
    }),
    updatedAt: z.date({
      required_error: ErrorMessage.Validator.InvalidUpdatedAt,
      invalid_type_error: ErrorMessage.Validator.InvalidUpdatedAt,
    }),
  });

  validate(entity: IUserProps): void {
    try {
      this.schema.parse(entity);
    } catch (error: any) {
      const zodError = error as ZodError;
      throw new UserException(zodError.message);
    }
    this.schema.parse(entity);
  }
}
