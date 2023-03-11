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
    const newUser = new User(uuid(), username, email, new Date(), new Date());
    newUser.changePassword(PasswordFactory.createNew(password));

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
    const newUser = new User(id, username, email, createdAt, updatedAt);
    newUser.changePassword(PasswordFactory.createFromHash(password));

    return newUser;
  }
}
