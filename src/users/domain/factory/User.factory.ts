import { v4 as uuid } from 'uuid';

import type { IUser } from '../entity/user.interface';
import type { IEventDispatcher } from '@shared/domain/event/event.dispatcher.interface';

import { User } from '../entity/User';

import { PasswordFactory } from './Password.factory';
import { UserEventFactory } from './User.event.factory';

export class UserFactory {
  public static create(
    eventDispatcher: IEventDispatcher<IUser>,
    username: string,
    email: string,
    password: string,
  ): User {
    const newUser = new User(
      uuid(),
      username,
      email,
      PasswordFactory.createNew(password),
      new Date(),
      new Date(),
    );

    eventDispatcher.notify(UserEventFactory.created(newUser));

    return newUser;
  }

  public static createFromPersistence(
    id: string,
    username: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    password: string,
  ): User {
    const newUser = new User(
      id,
      username,
      email,
      PasswordFactory.createFromHash(password),
      createdAt,
      updatedAt,
    );

    return newUser;
  }
}
