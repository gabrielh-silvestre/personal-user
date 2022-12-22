import { hashSync, compareSync, genSaltSync } from 'bcrypt';

import type { IPassword } from './password.interface';

import { UserException } from '@users/domain/exception/User.exception';

export class Password implements IPassword {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 16;

  private _password: string;

  constructor(password: string, hash = false) {
    this._password = password;

    if (hash) {
      this.validate(password);
      this.hash();
    }
  }

  private hash(): void {
    const salt = genSaltSync(10);
    this._password = hashSync(this._password, salt);
  }

  private validate(password: string): void | never {
    if (!password || password.length === 0) {
      throw new UserException('Password is required');
    }

    if (password.length < Password.MIN_LENGTH) {
      throw new UserException(
        `Password must be at least ${Password.MIN_LENGTH} characters long`,
      );
    }

    if (password.length > Password.MAX_LENGTH) {
      throw new UserException(
        `Password must be at most ${Password.MAX_LENGTH} characters long`,
      );
    }
  }

  toString(): string {
    return this._password;
  }

  isEqual(password: string): boolean {
    return compareSync(password, this._password);
  }
}
