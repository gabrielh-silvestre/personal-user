import { v4 as uuid } from 'uuid';

import { User } from '../entity/User';
import { PasswordFactory } from './Password.factory';
import { OrmUserDto } from '@users/infra/gateway/database/Database.gateway.interface';

export class UserFactory {
  public static create(
    username: string,
    email: string,
    password: string,
  ): User {
    const newUser = new User({
      id: uuid(),
      username,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: PasswordFactory.createNew(password),
    });

    return newUser;
  }

  /**
   * @deprecated Use transformFromDto instead, this method is more specific for the gateway
   */
  public static createFromPersistence(
    _id: string,
    _username: string,
    _email: string,
    _createdAt: Date,
    _updatedAt: Date,
    _password: string,
  ): User {
    throw new Error('Method not implemented.');
  }

  public static transformFromDto(dto: OrmUserDto): User {
    const newUser = new User({
      id: dto.id,
      username: dto.username,
      email: dto.email,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      password: PasswordFactory.createFromHash(dto.password),
    });

    return newUser;
  }
}
