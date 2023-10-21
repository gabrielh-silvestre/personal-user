import type { IUser, IUserProps, UserProps } from './user.interface';
import type { IPassword } from '../value-object/Password/password.interface';

import { Entity } from '@shared/domain/entity/Entity.abstract';

import { UserValidatorFactory } from '../factory/User.validator.factory';

export class User extends Entity<UserProps> implements IUser {
  constructor(props: IUserProps) {
    super(props);

    this.validate();
  }

  private validate(): void {
    UserValidatorFactory.create().validate(this);
  }

  changeUsername(username: string): void {
    this.set('username', username);

    this.validate();
  }

  changeEmail(email: string): void {
    this.set('email', email);

    this.validate();
  }

  changePassword(password: IPassword): void {
    this.set('password', password);

    this.validate();
  }

  get username(): string {
    return this.get('username');
  }

  get email(): string {
    return this.get('email');
  }

  get password(): IPassword {
    return this.get('password');
  }
}
