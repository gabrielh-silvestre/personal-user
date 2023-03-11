import { v4 as uuid } from 'uuid';

import type { IUser } from '../entity/user.interface';

import { UserCreatedEvent } from '../event/UserCreated.event';
import { UserUpdateUsernameEvent } from '../event/UserUpdateUsername.event';

export class UserEventFactory {
  static created(user: IUser): UserCreatedEvent {
    return new UserCreatedEvent(uuid(), user);
  }

  static usernameChanged(user: IUser): UserUpdateUsernameEvent {
    return new UserUpdateUsernameEvent(uuid(), user);
  }
}
